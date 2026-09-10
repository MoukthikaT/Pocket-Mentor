import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { createStudyPack } from '../services/studyStore';
import { createWorker } from 'tesseract.js';
import { ArrowLeft, ImageUp, LoaderCircle, Sparkles, X } from 'lucide-react';

export default function CreateStudy() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    topic: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('Please choose a JPG, PNG, or WebP image.');
    if (file.size > 5 * 1024 * 1024) return setError('Please choose an image smaller than 5 MB.');
    setError('');
    setImage({ file, preview: URL.createObjectURL(file) });
  };

  const extractTextFromImage = async () => {
    if (!image?.file) return;
    setExtracting(true);
    setError('');
    try {
      const worker = await createWorker('eng');
      const { data } = await worker.recognize(image.file);
      await worker.terminate();
      const extractedText = data.text.trim();
      if (!extractedText) throw new Error('No readable text was found. Try a brighter, sharper photo.');
      setForm((current) => ({ ...current, content: current.content ? `${current.content}\n\n${extractedText}` : extractedText }));
    } catch (ocrError) {
      setError(ocrError.message || 'We could not read that image. Please try another photo.');
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!form.topic.trim() || !form.content.trim() || form.content.trim().length < 30) {
      setError('Please add a valid topic and notes with at least 30 characters.');
      setLoading(false);
      return;
    }

    try {
      const noteResponse = await api.post('/notes', {
        title: form.topic,
        content: form.content,
        sourceType: 'paste',
      });

      const aiResponse = await api.post('/ai/generate', {
        topic: form.topic,
        notes: form.content,
      });

      const pack = createStudyPack({ note: noteResponse.data, material: aiResponse.data, userId: user?._id });
      navigate(`/study-material/${pack.id}`, { state: { pack, user } });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to generate study pack right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/80 bg-white/90 p-6 shadow-soft backdrop-blur sm:p-8">
        <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700">Study generation</p><h1 className="mt-3 text-3xl font-bold text-slate-900">Create your revision pack</h1><p className="mt-2 text-slate-600">Paste your notes and we’ll turn them into a focused study session.</p></div><button type="button" className="btn-secondary gap-2" onClick={() => navigate('/dashboard')}><ArrowLeft size={16} />Dashboard</button></div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">Topic Name</label>
            <input type="text" name="topic" placeholder="e.g. Cell Biology" className="input-field" value={form.topic} onChange={handleChange} required />
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">
            <div className="mb-2 flex items-center justify-between gap-3"><label className="block text-sm font-medium text-slate-700">Notes / Study Material</label><span className={`text-xs font-medium ${form.content.length < 30 ? 'text-slate-400' : 'text-accent-600'}`}>{form.content.length} characters</span></div>
            <textarea
              name="content"
              rows="12"
              className="input-field min-h-[220px] resize-none"
              value={form.content}
              onChange={handleChange}
              placeholder="Paste your notes here..."
              required
            />
          </div>

          <div className="rounded-2xl border border-dashed border-primary-200 bg-primary-50/60 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="font-semibold text-slate-800">Upload a photo of your notes</p><p className="mt-1 text-sm text-slate-600">We’ll extract the text from printed or handwritten pages. Review it before generating.</p></div>
              <label className="btn-secondary cursor-pointer gap-2"><ImageUp size={17} />Choose image<input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} /></label>
            </div>
            {image && <div className="mt-4 flex flex-col gap-4 rounded-xl bg-white p-3 sm:flex-row sm:items-center"><img src={image.preview} alt="Selected notes" className="h-24 w-full rounded-lg object-cover sm:w-36" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{image.file.name}</p><p className="mt-1 text-xs text-slate-500">{Math.ceil(image.file.size / 1024)} KB · OCR runs in your browser</p><button type="button" className="btn-primary mt-3 gap-2" onClick={extractTextFromImage} disabled={extracting}>{extracting ? <><LoaderCircle className="animate-spin" size={16} />Reading your notes…</> : 'Extract text from image'}</button></div><button type="button" aria-label="Remove selected image" className="self-start rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800" onClick={() => setImage(null)}><X size={18} /></button></div>}
          </div>

          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <button type="submit" className="btn-primary w-full gap-2 sm:w-auto" disabled={loading}>
            <Sparkles size={17} /> {loading ? 'Pocket Mentor is understanding your notes...' : 'Generate Revision Pack'}
          </button>
        </form>
      </div>
    </div>
  );
}
