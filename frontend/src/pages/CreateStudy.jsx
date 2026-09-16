import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { createStudyPack } from '../services/studyStore';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth';
import JSZip from 'jszip';
import {
  ArrowLeft,
  LoaderCircle,
  Sparkles,
  X,
  FileText,
  Upload,
  ShieldCheck,
} from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const supportedExtensions = ['pdf', 'ppt', 'pptx', 'doc', 'docx', 'txt', 'md', 'png', 'jpg', 'jpeg', 'webp'];

const getExtension = (file) => file.name.toLowerCase().split('.').pop();

const extractPdfText = async (file) => {
  const document = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str || '').join(' '));
  }

  return pages.join('\n\n');
};

const extractScannedPdfText = async (file, onProgress) => {
  const pdfDocument = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  onProgress(`Preparing OCR for ${pdfDocument.numPages} page${pdfDocument.numPages === 1 ? '' : 's'}...`);
  const worker = await createWorker('eng');
  const pages = [];

  try {
    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
      onProgress(`Reading page ${pageNumber} of ${pdfDocument.numPages}...`);
      const page = await pdfDocument.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      const result = await worker.recognize(canvas);
      pages.push(result.data.text);
    }
  } finally {
    await worker.terminate();
  }

  return pages.join('\n\n');
};

const extractPowerPointText = async (file) => {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
    .sort((left, right) => Number(left.match(/slide(\d+)/i)[1]) - Number(right.match(/slide(\d+)/i)[1]));

  return Promise.all(slideFiles.map(async (name) => {
    const xml = await zip.files[name].async('text');
    const document = new DOMParser().parseFromString(xml, 'application/xml');
    return Array.from(document.getElementsByTagNameNS('*', 't')).map((node) => node.textContent).join(' ');
  })).then((slides) => slides.join('\n\n'));
};

const extractUploadedText = async (file, onProgress) => {
  const extension = getExtension(file);

  if (extension === 'pdf') {
    const text = await extractPdfText(file);
    return text.trim().length >= 30 ? text : extractScannedPdfText(file, onProgress);
  }
  if (extension === 'docx') {
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value;
  }
  if (extension === 'pptx') return extractPowerPointText(file);
  if (['txt', 'md'].includes(extension)) return file.text();
  if (['png', 'jpg', 'jpeg', 'webp'].includes(extension) || file.type.startsWith('image/')) {
    const worker = await createWorker('eng');
    try {
      const result = await worker.recognize(file);
      return result.data.text;
    } finally {
      await worker.terminate();
    }
  }

  throw new Error(extension === 'doc'
    ? 'Legacy .doc files are not supported in the browser. Save it as .docx and upload it again.'
    : 'This file type is not supported. Upload PDF, PPTX, DOCX, TXT, Markdown, or an image.');
};

export default function CreateStudy() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    topic: '',
    content: '',
  });

  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractingMessage, setExtractingMessage] = useState('');
  const [error, setError] = useState('');
  const [sourceFile, setSourceFile] = useState(null);

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));

    if (error) {
      setError('');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!supportedExtensions.includes(getExtension(file))) {
      setError('Please choose a PDF, PPTX, DOCX, TXT, Markdown, or image file.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError('Please choose a file smaller than 25 MB.');
      return;
    }

    setExtracting(true);
    setExtractingMessage('Reading your file...');
    setError('');

    try {
      const extractedText = (await extractUploadedText(file, setExtractingMessage)).trim();

      if (!extractedText) {
        throw new Error('No readable study text was found in that file.');
      }

      setForm((current) => ({
        ...current,
        content: current.content
          ? `${current.content}\n\n${extractedText}`
          : extractedText,
      }));
      setSourceFile({ file, preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null });
    } catch (ocrError) {
      setSourceFile(null);
      setError(ocrError.message || 'We could not read that file. Please try another one.');
    } finally {
      setExtracting(false);
      setExtractingMessage('');
    }
  };


  /*
   * --------------------------------------------------
   * GENERATE REVISION PACK
   * --------------------------------------------------
   *
   * IMPORTANT:
   *
   * topic = label/context only
   *
   * content = ONLY academic source
   *
   * The backend will reject the request if content
   * is missing or too short.
   */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    const topic =
      form.topic.trim();

    const notes =
      form.content.trim();


    /*
     * Topic validation
     */
    if (!topic) {
      setError(
        'Please enter a subject or topic name.'
      );

      setLoading(false);
      return;
    }


    /*
     * Notes validation
     *
     * Subject name alone is NEVER enough.
     */
    if (!notes) {
      setError(
        'Please add your study material. Pocket Mentor creates quizzes and flashcards only from your own notes.'
      );

      setLoading(false);
      return;
    }


    if (notes.length < 30) {
      setError(
        `Please add at least 30 characters of study material. You currently have ${notes.length}.`
      );

      setLoading(false);
      return;
    }


    try {
      /*
       * ------------------------------------------------
       * STEP 1 — SAVE THE USER'S ORIGINAL NOTES
       * ------------------------------------------------
       */

      const noteResponse =
        await api.post(
          '/notes',
          {
            title: topic,

            content: notes,

            sourceType: sourceFile ? 'upload' : 'paste',
          }
        );


      /*
       * ------------------------------------------------
       * STEP 2 — GENERATE AI MATERIAL
       * ------------------------------------------------
       *
       * Send BOTH values.
       *
       * The backend treats `notes` as the ONLY
       * academic source.
       */

      const aiResponse =
        await api.post(
          '/ai/generate',
          {
            topic,

            notes,
          }
        );


      /*
       * The API response in your current project
       * is expected to contain the generated material.
       */
      const material =
        aiResponse.data?.data ||
        aiResponse.data;


      if (!material) {
        throw new Error(
          'No revision material was returned.'
        );
      }


      /*
       * ------------------------------------------------
       * STEP 3 — KEEP NOTES WITH LOCAL STUDY PACK
       * ------------------------------------------------
       *
       * This is important for:
       *
       * Quiz
       * Flashcards
       * Boss Battle
       * Rescue Mode
       * Teach a Friend
       *
       * They should all refer back to this material.
       */

      const savedNote =
        noteResponse.data?.data ||
        noteResponse.data;

      const noteForPack = {
        ...savedNote,

        /*
         * Make absolutely sure the original notes
         * remain available even if the API response
         * doesn't return content.
         */
        content:
          savedNote?.content ||
          notes,

        title:
          savedNote?.title ||
          topic,
      };


      const pack =
        createStudyPack({
          note:
            noteForPack,

          material,

          userId:
            user?._id ||
            user?.id,
        });


      /*
       * ------------------------------------------------
       * STEP 4 — OPEN STUDY MATERIAL
       * ------------------------------------------------
       */

      navigate(
        `/study-material/${pack.id}`,
        {
          state: {
            pack,

            user,
          },
        }
      );

    } catch (err) {
      console.error(
        'Revision pack generation error:',
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          'Unable to generate your revision pack right now.'
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">

      <div className="mx-auto max-w-4xl rounded-3xl border border-white/80 bg-white/90 p-6 shadow-soft backdrop-blur sm:p-8">

        {/* ------------------------------------------------ */}
        {/* HEADER */}
        {/* ------------------------------------------------ */}

        <div className="flex items-start justify-between gap-4">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700">
              Study generation
            </p>

            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              Create your revision pack
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Give Pocket Mentor your own study material.
              It will turn that material into a focused
              revision session.
            </p>

          </div>

          <button
            type="button"
            className="btn-secondary gap-2"
            onClick={() =>
              navigate('/dashboard')
            }
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>

        </div>


        {/* ------------------------------------------------ */}
        {/* SOURCE GUARANTEE */}
        {/* ------------------------------------------------ */}

        <div className="mt-6 flex gap-3 rounded-2xl border border-primary-100 bg-primary-50/70 p-4">

          <div className="mt-0.5 rounded-xl bg-white p-2 text-primary-700 shadow-sm">
            <ShieldCheck size={20} />
          </div>

          <div>

            <p className="font-semibold text-slate-800">
              Your notes are the source
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Quizzes, flashcards and revision content
              are created from the study material you
              provide. A subject name by itself is not
              used to generate random questions.
            </p>

          </div>

        </div>


        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >

          {/* ------------------------------------------------ */}
          {/* TOPIC */}
          {/* ------------------------------------------------ */}

          <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Subject / Topic
            </label>

            <input
              type="text"
              name="topic"
              placeholder="Enter the subject or topic name"
              className="input-field"
              value={form.topic}
              onChange={handleChange}
            />

            <p className="mt-2 text-xs text-slate-500">
              This identifies your study pack. The topic
              name alone will not generate questions.
            </p>

          </div>


          {/* ------------------------------------------------ */}
          {/* NOTES */}
          {/* ------------------------------------------------ */}

          <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">

            <div className="mb-2 flex items-center justify-between gap-3">

              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">

                <FileText size={16} />

                Your Notes / Study Material

              </label>

              <span
                className={`text-xs font-medium ${
                  form.content.length < 30
                    ? 'text-slate-400'
                    : 'text-accent-600'
                }`}
              >
                {form.content.length} characters
              </span>

            </div>


            <textarea
              name="content"
              rows="12"
              className="input-field min-h-[220px] resize-none"
              value={form.content}
              onChange={handleChange}
              placeholder="Paste your class notes, textbook notes, lecture notes, PDF text, handwritten-note OCR text, or other study material here..."
              required
            />


            <div className="mt-3 flex items-start gap-2 text-xs text-slate-500">

              <ShieldCheck
                size={15}
                className="mt-0.5 shrink-0"
              />

              <p>
                Pocket Mentor uses this material as the
                source for your summary, flashcards and
                quiz questions.
              </p>

            </div>

          </div>


          {/* ------------------------------------------------ */}
          {/* FILE SOURCE */}
          {/* ------------------------------------------------ */}

          <div className="rounded-2xl border border-dashed border-primary-200 bg-primary-50/60 p-4 sm:p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="font-semibold text-slate-800">
                  Upload a file or image
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  PDF, PowerPoint, Word, text, and image files are read automatically.
                </p>

              </div>


              <label className="btn-secondary cursor-pointer gap-2">

                <Upload size={17} />

                Choose file

                <input
                  className="sr-only"
                  type="file"
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.md,image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                />

              </label>

            </div>


            {sourceFile && (

              <div className="mt-4 flex flex-col gap-4 rounded-xl bg-white p-3 sm:flex-row sm:items-center">

                {sourceFile.preview ? (
                  <img src={sourceFile.preview} alt="Selected notes" className="h-24 w-full rounded-lg object-cover sm:w-36" />
                ) : (
                  <div className="flex h-24 w-full items-center justify-center rounded-lg bg-primary-50 text-primary-700 sm:w-36"><FileText size={30} /></div>
                )}


                <div className="min-w-0 flex-1">

                  <p className="truncate text-sm font-semibold text-slate-800">
                    {sourceFile.file.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {Math.ceil(
                      sourceFile.file.size / 1024
                    )}{' '}
                    KB · Text extracted automatically
                  </p>

                </div>


                <button
                  type="button"
                  aria-label="Remove selected image"
                  className="self-start rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  onClick={() =>
                    setSourceFile(null)
                  }
                >
                  <X size={18} />
                </button>

              </div>

            )}

          </div>


          {/* ------------------------------------------------ */}
          {/* ERROR */}
          {/* ------------------------------------------------ */}

          {error && (

            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">

              {error}

            </div>

          )}


          {/* ------------------------------------------------ */}
          {/* GENERATE */}
          {/* ------------------------------------------------ */}

          <button
            type="submit"
            className="btn-primary w-full gap-2 sm:w-auto"
            disabled={loading || extracting}
          >

            {extracting ? (
              <><LoaderCircle size={17} className="animate-spin" /> {extractingMessage || 'Reading your file…'}</>
            ) : loading ? (
              <>
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />

                Creating from your notes…
              </>
            ) : (
              <>
                <Sparkles size={17} />

                Generate Revision Pack
              </>
            )}

          </button>

        </form>

      </div>

    </div>
  );
}