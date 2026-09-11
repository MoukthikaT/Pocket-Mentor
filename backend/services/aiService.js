import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

// --------------------------------------------------
// ENVIRONMENT
// --------------------------------------------------

const apiKey = process.env.GEMINI_API_KEY;

const MODEL =
  process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

console.log('------------------------------------');
console.log('AI SERVICE ENVIRONMENT CHECK');
console.log(
  'GEMINI_API_KEY:',
  apiKey ? 'GEMINI KEY FOUND' : 'GEMINI KEY NOT FOUND'
);
console.log('GEMINI_MODEL:', MODEL);
console.log('------------------------------------');

const genAI = apiKey
  ? new GoogleGenerativeAI(apiKey)
  : null;


// --------------------------------------------------
// BASIC HELPERS
// --------------------------------------------------

const cleanText = (value) => {
  if (value === undefined || value === null) {
    return '';
  }

  return String(value).trim();
};


// --------------------------------------------------
// AI CONFIGURATION
// --------------------------------------------------

const ensureAIConfigured = () => {
  if (!apiKey || !genAI) {
    const error = new Error(
      'Gemini AI is not configured. Please check GEMINI_API_KEY in backend/.env.'
    );

    error.statusCode = 503;

    throw error;
  }
};


// --------------------------------------------------
// GET GEMINI MODEL
// --------------------------------------------------

const getModel = () => {
  ensureAIConfigured();

  return genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
    },
  });
};


// --------------------------------------------------
// USER MATERIAL VALIDATION
// --------------------------------------------------

const requireUserMaterial = ({ topic, notes }) => {
  const cleanTopic = cleanText(topic);
  const cleanNotes = cleanText(notes);

  if (!cleanTopic) {
    const error = new Error(
      'Please enter your subject.'
    );

    error.statusCode = 400;
    throw error;
  }

  if (!cleanNotes) {
    const error = new Error(
      'Please provide your own study material first.'
    );

    error.statusCode = 400;
    throw error;
  }

  if (cleanNotes.length < 30) {
    const error = new Error(
      'Please provide at least 30 characters of your own study material.'
    );

    error.statusCode = 400;
    throw error;
  }

  return {
    topic: cleanTopic,
    notes: cleanNotes,
  };
};


// --------------------------------------------------
// NORMAL GEMINI REQUEST
// --------------------------------------------------

const askGemini = async ({
  systemPrompt,
  userPrompt,
}) => {
  const model = getModel();

  const prompt = `
You are Pocket Mentor, an intelligent personal AI study mentor.

The student has supplied their OWN study material.

==================================================
SOURCE RULE
==================================================

Use the student's supplied study material as the primary academic source.

Do NOT invent:
- subjects
- chapters
- syllabus
- unrelated academic topics
- unrelated textbook information

You may:
- reorganize the material
- simplify difficult wording
- explain concepts already present
- create examples for concepts already present
- create practice questions from the material

If the material does not contain enough information,
clearly say that.

==================================================
QUALITY
==================================================

The student wants beginner-friendly explanations.

When useful:

1. Simple explanation
2. Detailed explanation
3. Step-by-step explanation
4. Example
5. Important points
6. Common mistakes
7. Exam-ready answer

Avoid vague filler.

==================================================

${systemPrompt}

==================================================
STUDENT MATERIAL / REQUEST
==================================================

${userPrompt}

==================================================

FINAL CHECK

Use the student's material.
Do not invent missing academic information.
Make the answer useful for studying.
`;


  console.log('Calling Gemini...');
  console.log('Model:', MODEL);

  try {
    const result = await model.generateContent(prompt);

    const response = result.response;
    const text = response.text();

    if (!text || !text.trim()) {
      throw new Error(
        'Gemini returned an empty response.'
      );
    }

    console.log('Gemini response received successfully.');

    return text.trim();

  } catch (error) {

    console.error('GEMINI API ERROR');
    console.error('Message:', error?.message);
    console.error('Status:', error?.status);
    console.error('Status Code:', error?.statusCode);
    console.error('Code:', error?.code);

    throw error;
  }
};


// --------------------------------------------------
// JSON GEMINI REQUEST
// --------------------------------------------------

const askGeminiJSON = async ({
  systemPrompt,
  userPrompt,
}) => {

  const model = getModel();

  const prompt = `
You are Pocket Mentor, an intelligent AI study mentor.

The student has supplied their OWN academic material.

Use that material as the source.

DO NOT invent:
- subjects
- chapters
- syllabus
- unrelated academic information
- missing textbook information

You may explain, reorganize and simplify concepts already contained
in the student's material.

==================================================
QUALITY REQUIREMENTS
==================================================

Create useful educational content.

Use beginner-friendly explanations.

Do not give shallow one-line answers.

==================================================

${systemPrompt}

==================================================
STUDENT MATERIAL
==================================================

${userPrompt}

==================================================

IMPORTANT JSON RULE

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT use:
\`\`\`json

Do NOT write anything before the JSON.

Do NOT write anything after the JSON.

The response must be directly parseable by JSON.parse().
`;


  console.log('Calling Gemini JSON...');
  console.log('Model:', MODEL);

  try {

    const result = await model.generateContent(prompt);

    const text = result.response.text().trim();

    if (!text) {
      throw new Error(
        'Gemini returned an empty response.'
      );
    }

    let cleaned = text;

    // Remove markdown fences if Gemini accidentally adds them
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned
        .replace(/^```json\s*/i, '')
        .replace(/```$/i, '')
        .trim();
    }

    if (cleaned.startsWith('```')) {
      cleaned = cleaned
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();
    }

    try {

      const parsed = JSON.parse(cleaned);

      console.log(
        'Gemini JSON response parsed successfully.'
      );

      return parsed;

    } catch (parseError) {

      console.error(
        'Gemini JSON parsing failed.'
      );

      console.error(
        'Gemini returned:',
        text
      );

      throw new Error(
        'Gemini returned invalid JSON. Please try again.'
      );
    }

  } catch (error) {

    console.error('GEMINI JSON API ERROR');
    console.error('Message:', error?.message);
    console.error('Status:', error?.status);
    console.error('Code:', error?.code);

    throw error;
  }
};


// --------------------------------------------------
// REVISION PACK
// --------------------------------------------------

export const generateRevisionPack = async (
  topic,
  notes
) => {

  const material = requireUserMaterial({
    topic,
    notes,
  });

  return askGeminiJSON({

    systemPrompt: `

Create a COMPLETE revision pack from the student's material.

Return EXACTLY this structure:

{
  "topic": "string",
  "summary": "detailed summary",
  "keyPoints": [
    "important point"
  ],
  "concepts": [
    {
      "title": "concept name",
      "explanation": "detailed beginner-friendly explanation",
      "example": "clear example",
      "examTip": "useful exam tip"
    }
  ],
  "commonMistakes": [
    "specific mistake"
  ],
  "quickRevision": [
    "important revision point"
  ],
  "practiceQuestions": [
    {
      "question": "question",
      "answer": "complete answer",
      "explanation": "detailed explanation"
    }
  ]
}

Create useful content based ONLY on the supplied material.

Approximately:

- 5-10 key points
- 4-8 concepts
- 3-6 common mistakes
- 5-10 quick revision points
- 5-10 practice questions

Do NOT create filler.

If the material supports fewer items,
create fewer items.

Practice answers must explain WHY,
not just give the answer.

`,

    userPrompt: `

SUBJECT:

${material.topic}

==================================================

STUDENT'S OWN STUDY MATERIAL:

${material.notes}

==================================================

Create the revision pack entirely from this material.

`,
  });
};


// --------------------------------------------------
// TEACH CONCEPT
// --------------------------------------------------

export const teachConcept = async ({
  topic,
  notes,
  question,
}) => {

  const material = requireUserMaterial({
    topic,
    notes,
  });

  const studentQuestion =
    cleanText(question);

  if (!studentQuestion) {
    const error = new Error(
      'Please enter what you want to learn.'
    );

    error.statusCode = 400;

    throw error;
  }

  return askGemini({

    systemPrompt: `

Teach the student's question using their supplied material.

Use this structure:

## Simple Explanation

## Detailed Explanation

## Step-by-Step

## Example

## Why It Matters

## Common Mistake

## Exam-Ready Answer

Do not invent information outside the material.

`,

    userPrompt: `

SUBJECT:

${material.topic}

==================================================

STUDENT MATERIAL:

${material.notes}

==================================================

STUDENT QUESTION:

${studentQuestion}

`,
  });
};


// --------------------------------------------------
// FLASHCARDS
// --------------------------------------------------

export const generateFlashcards = async (
  topic,
  notes
) => {

  const material = requireUserMaterial({
    topic,
    notes,
  });

  return askGeminiJSON({

    systemPrompt: `

Generate useful study flashcards.

Return:

{
  "cards": [
    {
      "question": "clear question",
      "answer": "complete answer",
      "explanation": "why the answer is correct"
    }
  ]
}

Generate 8-12 cards only when supported
by the student's material.

Do not invent information.

`,

    userPrompt: `

SUBJECT:

${material.topic}

==================================================

STUDENT MATERIAL:

${material.notes}

`,
  });
};


// --------------------------------------------------
// SUMMARY
// --------------------------------------------------

export const summarizeNotes = async (
  topic,
  notes
) => {

  const material = requireUserMaterial({
    topic,
    notes,
  });

  return askGemini({

    systemPrompt: `

Create a high-quality study summary.

Preserve important information.

Organize related ideas.

Explain difficult concepts.

Highlight terminology.

Do not add unrelated academic information.

Use readable headings and paragraphs.

`,

    userPrompt: `

SUBJECT:

${material.topic}

==================================================

STUDENT NOTES:

${material.notes}

`,
  });
};


// --------------------------------------------------
// AI CHALLENGE
// --------------------------------------------------

export const generateChallenge = async (
  topic,
  notes
) => {

  const material = requireUserMaterial({
    topic,
    notes,
  });

  return askGeminiJSON({

    systemPrompt: `

Create one meaningful learning challenge.

Return EXACTLY:

{
  "question": "clear challenging question",
  "options": [
    "option A",
    "option B",
    "option C",
    "option D"
  ],
  "correctAnswer": 0,
  "explanation": "detailed explanation",
  "hint": "useful hint"
}

The challenge must be answerable
from the student's material.

Do not invent information.

`,

    userPrompt: `

SUBJECT:

${material.topic}

==================================================

STUDENT MATERIAL:

${material.notes}

`,
  });
};


// --------------------------------------------------
// BOSS BATTLE
// --------------------------------------------------

export const generateBossQuestion = async ({
  topic,
  notes,
  difficulty = 'hard',
}) => {

  const material = requireUserMaterial({
    topic,
    notes,
  });

  return askGeminiJSON({

    systemPrompt: `

Generate ONE challenging question.

Difficulty:

${difficulty}

Return EXACTLY:

{
  "question": "challenging question",
  "options": [
    "option A",
    "option B",
    "option C",
    "option D"
  ],
  "correctAnswer": 0,
  "explanation": "detailed explanation",
  "hint": "useful hint"
}

The question must be answerable
from the student's material.

Do not invent information.

`,

    userPrompt: `

SUBJECT:

${material.topic}

==================================================

STUDENT MATERIAL:

${material.notes}

`,
  });
};


// --------------------------------------------------
// MISTAKE ANALYSIS
// --------------------------------------------------

export const explainMistake = async ({
  topic,
  notes,
  question,
  studentAnswer,
  correctAnswer,
}) => {

  const material = requireUserMaterial({
    topic,
    notes,
  });

  return askGemini({

    systemPrompt: `

You are Pocket Mentor's mistake-recovery tutor.

Explain:

## What Was Being Tested

## Your Answer

## Why It Was Incorrect

## Correct Answer

## Where The Reasoning Went Wrong

## How To Avoid This Next Time

## Memory Trick

## Exam Tip

Be encouraging but accurate.

Do not invent academic information.

`,

    userPrompt: `

SUBJECT:

${material.topic}

==================================================

STUDENT MATERIAL:

${material.notes}

==================================================

QUESTION:

${cleanText(question)}

==================================================

STUDENT ANSWER:

${cleanText(studentAnswer)}

==================================================

CORRECT ANSWER:

${cleanText(correctAnswer)}

`,
  });
};


// --------------------------------------------------
// DEFAULT EXPORT
// --------------------------------------------------

export default {
  generateRevisionPack,
  generateChallenge,
  generateBossQuestion,
  teachConcept,
  explainMistake,
  generateFlashcards,
  summarizeNotes,
};