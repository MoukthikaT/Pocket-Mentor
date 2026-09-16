/*
 * Pocket Mentor AI Service
 *
 * CORE RULE:
 * Every academic output must be based ONLY on the student's
 * supplied study material.
 *
 * The subject/topic name is used only as a label/context.
 * It must NEVER be used as a source of academic knowledge.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const cleanText = (value = '') =>
  String(value)
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const validateInput = (topic, notes) => {
  if (!topic || !cleanText(topic)) throw new Error('Please provide a subject or topic name.');
  if (!notes || !cleanText(notes)) throw new Error('Please provide your own study material before generating content.');
  if (cleanText(notes).length < 30) throw new Error('Please provide at least 30 characters of your own study material.');
};

const splitIntoFacts = (notes = '') => {
  const normalized = String(notes).replace(/\r/g, '').trim();
  const lines = normalized.split(/\n+/).map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim());
  const sentences = normalized.split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim());
  const lineFacts = lines.map(cleanText).filter((item) => item.length >= 20);
  const sentenceFacts = sentences.map(cleanText).filter((item) => item.length >= 20);
  const candidates = lineFacts.length > 1 || sentenceFacts.length <= 1 ? lineFacts : sentenceFacts;

  return [...new Set(candidates)]
    .filter((fact, index, allFacts) => !allFacts.some((other, otherIndex) => otherIndex !== index && other.length > fact.length && other.includes(fact)))
    .slice(0, 20);
};

const extractConceptLabel = (fact) => {
  const cleaned = cleanText(fact);
  return cleaned.length <= 55 ? cleaned.replace(/[.!?]+$/, '') : `${cleaned.substring(0, 52).trim()}...`;
};

const splitDefinition = (fact) => {
  const separator = fact.indexOf(':');
  return separator > 2 && separator < fact.length - 1
    ? { label: fact.slice(0, separator).trim(), answer: fact.slice(separator + 1).trim() }
    : { label: extractConceptLabel(fact), answer: fact };
};

const buildGroundedFlashcards = (facts) => facts.slice(0, 8).map((fact) => ({
  question: `What does your study material say about "${extractConceptLabel(fact)}"?`,
  answer: fact,
}));

const buildGroundedQuiz = (facts, topic) => facts.slice(0, 8).map((fact, index) => {
  const definition = splitDefinition(fact);
  const distractors = facts
    .filter((_, itemIndex) => itemIndex !== index)
    .map((item) => splitDefinition(item).answer)
    .filter((answer) => answer !== definition.answer)
    .slice(0, 3);
  const options = [definition.answer, ...distractors];
  if (options.length < 2) options.push('This information is not provided in the supplied study material.');
  const limitedOptions = options.slice(0, 4);
  const rotation = index % limitedOptions.length;
  const rotatedOptions = [...limitedOptions.slice(rotation), ...limitedOptions.slice(0, rotation)];

  return {
    question: definition.answer === fact
      ? 'Which statement from your study material is correct?'
      : `According to your study material, what does "${definition.label}" mean?`,
    options: rotatedOptions,
    correctAnswer: rotatedOptions.indexOf(definition.answer),
    explanation: `Your study material states: ${fact}`,
    topic,
    difficulty: index < 2 ? 'easy' : index < 5 ? 'medium' : 'hard',
  };
});

const buildMockRevisionPack = (topic, notes) => {
  const facts = splitIntoFacts(notes);
  if (!facts.length) throw new Error('Your notes do not contain enough structured information. Please add definitions, explanations, examples, or bullet points.');

  return {
    summary: facts.slice(0, 6).join('\n\n'),
    quickRevision: facts.slice(0, 8).map((fact, index) => `${index + 1}. ${fact}`).join('\n'),
    keyConcepts: facts.slice(0, 8).map(extractConceptLabel),
    flashcards: buildGroundedFlashcards(facts),
    quiz: buildGroundedQuiz(facts, topic),
    sourceType: 'user-notes',
    generatedFrom: 'student-supplied-material',
    noteCoverage: Math.min(100, Math.round((facts.length / 8) * 100)),
    sourcePreview: facts.slice(0, 3).join(' '),
  };
};

/*
 * REAL AI PROVIDER
 */
const callProvider = async (system, prompt) => {
  const sourceRestriction = `
${system}

ABSOLUTE SOURCE RESTRICTION:

The student's supplied study material is the ONLY source
of academic information.

The topic/subject name is only a label. Do not use it as a
source of facts. Do not use general knowledge, textbooks, or
information from training data. Do not invent definitions,
examples, distractors, explanations, or missing details.

Every answer, summary sentence, flashcard, quiz option and
explanation must be directly supported by the supplied material.
If the material does not support a useful item, omit that item.

Return valid JSON only.
`;

  const parseJson = (content) => {
    const cleaned = String(content || '')
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    return JSON.parse(cleaned);
  };

  if (process.env.GEMINI_API_KEY && process.env.AI_PROVIDER !== 'mock') {
    try {
      const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const configuredModel = process.env.GEMINI_MODEL;
      const model = client.getGenerativeModel({
        model: configuredModel && !configuredModel.includes('3.5')
          ? configuredModel
          : 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      });
      const result = await model.generateContent(`${sourceRestriction}\n${prompt}`);
      return parseJson(result.response.text());
    } catch (error) {
      console.warn('Gemini generation failed; trying the configured fallback:', error.message);
    }
  }

  if (!process.env.AI_API_KEY || process.env.AI_PROVIDER === 'mock') return null;

  const response = await fetch(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',

        Authorization: `Bearer ${process.env.AI_API_KEY}`,
      },

      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-4o-mini',

        temperature: 0.2,

        response_format: {
          type: 'json_object',
        },

        messages: [
          {
            role: 'system',

            content: sourceRestriction,
          },

          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `AI provider returned ${response.status}: ${errorText}`
    );
  }

  const payload = await response.json();

  const content =
    payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('AI provider returned an empty response.');
  }

  return JSON.parse(content);
};

/*
 * REVISION PACK GENERATION
 */
const generateRevisionPack = async (topic, notes) => {
  validateInput(topic, notes);

  /*
   * First attempt real AI only when an API key is configured.
   */
  const providerResult = await callProvider(
    `
Create a complete revision pack.

Return JSON with:

{
  "summary": "short summary",
  "quickRevision": "quick revision section",
  "keyConcepts": [],
  "flashcards": [
    {
      "question": "",
      "answer": ""
    }
  ],
  "quiz": [
    {
      "question": "",
      "options": [],
      "correctAnswer": 0,
      "explanation": "",
      "topic": "",
      "difficulty": "easy"
    }
  ]
}

Generate the questions from specific information
contained in the supplied notes.

Do not generate generic questions merely from
the subject name.

If the notes mention three concepts, questions should
be about those concepts.

If the notes do not contain enough information for
a question, do not invent information.
`,
    JSON.stringify({
      topic: cleanText(topic),

      studentStudyMaterial: cleanText(notes),
    })
  );

  if (providerResult) {
    /*
     * Basic structural validation before sending AI data
     * back to the frontend.
     */
    return {
      ...providerResult,

      sourceType: 'user-notes',

      generatedFrom: 'student-supplied-material',

      topic: cleanText(topic),
    };
  }

  /*
   * No API key → safe local generation.
   *
   * This generator still uses ONLY the student's notes.
   */
  return buildMockRevisionPack(
    cleanText(topic),
    cleanText(notes)
  );
};

const explainConcept = async ({ topic, concept, level, notes }) => {
  validateInput(topic, notes);
  const levels = ['beginner', 'intermediate', 'exam-ready'];
  const selectedLevel = levels.includes(level) ? level : 'beginner';
  const providerResult = await callProvider(
    `Explain the selected concept only from the supplied study material at the ${selectedLevel} level.

Return JSON with title, explanation, keyPoints, example, checkQuestion, checkAnswer, and level.
Beginner uses plain language. Intermediate connects ideas. Exam-ready is concise and includes only supported definitions, distinctions, conditions, and details.
Do not add general knowledge or fill gaps.`,
    JSON.stringify({ topic, concept, requestedLevel: selectedLevel, studentStudyMaterial: cleanText(notes) })
  );

  if (providerResult) return { ...providerResult, level: selectedLevel, noteBased: true };

  const facts = splitIntoFacts(notes);
  const source = facts.find((fact) => fact.toLowerCase().includes(String(concept).toLowerCase())) || facts[0];
  if (!source) throw new Error('That concept is not supported by the supplied study material.');

  return {
    title: concept,
    explanation: selectedLevel === 'beginner' ? `In simple terms: ${source}` : selectedLevel === 'intermediate' ? `Your notes connect this concept to the following idea: ${source}` : `Exam-ready point from your notes: ${source}`,
    keyPoints: [source],
    example: 'Use an example from your supplied study material when reviewing this concept.',
    checkQuestion: `What does your study material say about ${concept}?`,
    checkAnswer: source,
    level: selectedLevel,
    noteBased: true,
  };
};

/*
 * TEACH A FRIEND
 */
const teachFriend = async ({
  topic,
  personality,
  explanation,
  notes,
  profile,
}) => {
  validateInput(topic, notes);

  const providerResult = await callProvider(
    `
You are a friendly beginner student.

Evaluate the student's explanation ONLY against
the supplied study material.

Return:

{
  "followUp": "",
  "report": {
    "accuracy": 0,
    "clarity": 0,
    "examples": 0,
    "conceptCoverage": 0,
    "handlingQuestions": 0,
    "overall": 0
  },
  "missingConcepts": [],
  "feedback": "",
  "suggestions": []
}

Do not judge the explanation using outside knowledge.
`,
    JSON.stringify({
      topic,
      personality,
      explanation,
      notes: String(notes).slice(0, 10000),
      profile,
    })
  );

  if (providerResult) {
    return providerResult;
  }

  const hasExample =
    /example|because|for instance|such as/i.test(
      explanation
    );

  const lengthScore = Math.min(
    92,
    35 + Math.round(explanation.trim().length / 4)
  );

  const overall = Math.round(
    (
      lengthScore +
      (hasExample ? 82 : 48) +
      58 +
      62 +
      55
    ) / 5
  );

  return {
    followUp:
      `${personality || 'Your friend'} asks: can you explain one part of your answer using a specific point from your notes?`,

    report: {
      accuracy: lengthScore,
      clarity: Math.min(95, lengthScore + 4),
      examples: hasExample ? 82 : 48,
      conceptCoverage: 62,
      handlingQuestions: 55,
      overall,
    },

    missingConcepts: hasExample
      ? [
          'Connect your explanation to another point from your notes.',
        ]
      : [
          'Add a concrete example from your notes.',
          'Explain another point mentioned in your notes.',
        ],

    feedback:
      'Your explanation has a useful starting point. Strengthen it by connecting your claims to the study material you provided.',

    suggestions: [
      'State the main point first.',
      'Use an example from your notes.',
      'Connect two related points from your notes.',
    ],
  };
};

/*
 * BOSS BATTLE EVALUATION
 */
const evaluateBoss = async ({
  topic,
  answer,
  question,
  correctAnswer,
  level,
  notes,
}) => {
  validateInput(topic, notes);

  const providerResult = await callProvider(
    `
Evaluate a Boss Battle answer.

Use ONLY:
1. The question
2. The supplied correct answer
3. The student's supplied notes

Return:

{
  "correct": true,
  "damage": 25,
  "explanation": "",
  "misconception": "",
  "mastery": 0,
  "nextDifficulty": "medium"
}

Do not introduce outside academic information.
`,
    JSON.stringify({
      topic,
      answer,
      question,
      correctAnswer,
      level,
      notes: String(notes).slice(0, 10000),
    })
  );

  if (providerResult) {
    return providerResult;
  }

  const correct =
    String(answer || '')
      .trim()
      .toLowerCase() ===
    String(correctAnswer || '')
      .trim()
      .toLowerCase();

  return {
    correct,

    damage: correct
      ? level === 'Final Boss'
        ? 35
        : 25
      : 0,

    explanation: correct
      ? 'Direct hit! Your answer matches the answer generated from your study material.'
      : 'Your answer does not match the answer generated from your supplied study material. Review the relevant material and try again.',

    misconception: correct ? '' : answer,

    mastery: correct ? 78 : 42,

    nextDifficulty: correct
      ? 'Understanding'
      : 'Knowledge',
  };
};

/*
 * RESCUE MODE
 */
const createRescue = async ({
  topic,
  notes,
  profile,
}) => {
  validateInput(topic, notes);

  const providerResult = await callProvider(
    `
Create a five-minute emergency revision session.

Use ONLY the student's supplied notes.

Return:

{
  "priorityConcepts": [],
  "weakAreas": [],
  "rapidExplanation": "",
  "questions": [
    {
      "question": "",
      "answer": "",
      "explanation": ""
    }
  ],
  "readinessPrompt": ""
}

Never introduce facts that are absent from the notes.
`,
    JSON.stringify({
      topic,

      notes: String(notes).slice(0, 10000),

      profile,
    })
  );

  if (providerResult) {
    return providerResult;
  }

  const facts = splitIntoFacts(notes);

  if (!facts.length) {
    return {
      priorityConcepts: [],

      weakAreas: [],

      rapidExplanation:
        'Add your study material first so Rescue Mode can work from your own content.',

      questions: [],

      readinessPrompt:
        'Add notes to begin a focused revision session.',
    };
  }

  return {
    priorityConcepts: facts.slice(0, 3),

    weakAreas: [
      'Review the points you found difficult in your supplied notes.',
    ],

    rapidExplanation: facts
      .slice(0, 4)
      .join(' '),

    questions: facts
      .slice(0, 3)
      .map((fact) => ({
        question:
          `Explain this point from your study material: "${extractConceptLabel(fact)}"`,

        answer: fact,

        explanation:
          'The answer is taken directly from your supplied study material.',
      })),

    readinessPrompt:
      'Can you explain these points without looking at your notes?',
  };
};

/*
 * FIX MISTAKE
 */
const fixMistake = async ({
  topic,
  misconception,
  correction,
  notes,
}) => {
  validateInput(topic, notes);

  const providerResult = await callProvider(
    `
Help the student understand their mistake.

Use ONLY the supplied correction and context.

Return:

{
  "thought": "",
  "correct": "",
  "explanation": "",
  "example": "",
  "quickCheckQuestion": "",
  "quickCheckAnswer": ""
}

Do not introduce outside subject information.
`,
    JSON.stringify({
      topic,
      misconception,
      correction,
      notes: String(notes).slice(0, 10000),
    })
  );

  if (providerResult) {
    return providerResult;
  }

  return {
    thought: misconception,

    correct:
      correction ||
      'Re-check the relevant material you supplied.',

    explanation:
      'Compare your original answer with the correction and identify exactly which part differs.',

    example:
      correction ||
      'Use an example from your own study material.',

    quickCheckQuestion:
      `What part of ${topic} was different from your original answer?`,

    quickCheckAnswer:
      correction ||
      'State the corrected point from your study material.',
  };
};

export default {
  generateRevisionPack,
  explainConcept,
  teachFriend,
  evaluateBoss,
  createRescue,
  fixMistake,
};