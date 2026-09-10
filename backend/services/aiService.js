const buildMockRevisionPack = (topic, notes) => {
  const noteExcerpt = notes.replace(/\s+/g, ' ').trim().slice(0, 220);
  const summary = `The topic of ${topic} focuses on the ideas in your notes: ${noteExcerpt}. Use the definitions, relationships, examples, and reasoning in that material as your revision spine.`;

  const quickRevision = `Quick revision for ${topic}: review the main definitions, understand the main examples, and connect each concept to a simple real-world use case. Focus on the most repeated ideas and practice explaining them in your own words.`;

  const keyConcepts = [
    `Core idea from your notes: ${noteExcerpt.slice(0, 70)}`,
    'Main principles',
    'Key examples',
    'Common pitfalls',
    'Practical applications',
    'Connections between ideas',
  ];

  const flashcards = [
    { question: `What is the primary focus of ${topic}?`, answer: 'Understanding the core concept and its practical use in context.' },
    { question: `Why is it important to review examples in ${topic}?`, answer: 'Examples help explain how the concept is used and what patterns to look for.' },
    { question: `What should you remember while revising ${topic}?`, answer: 'Definitions, relationships, common mistakes, and how ideas connect to each other.' },
  ];

  const quiz = [
    {
      question: `Which statement best describes the main idea of ${topic}?`,
      options: [
        'It is about understanding the central definition and key relationships.',
        'It depends only on memorizing unrelated details.',
        'It is best ignored until the exam.',
        'It has no practical application.'
      ],
      correctAnswer: 0,
      explanation: 'The topic should be understood through its core definition and how the ideas relate to each other.',
      topic,
      difficulty: 'easy',
    },
    {
      question: `What is the best way to revise ${topic}?`,
      options: [
        'Memorize only one formula without context.',
        'Review definitions, examples, and key connections.',
        'Skip difficult areas completely.',
        'Avoid practice questions.'
      ],
      correctAnswer: 1,
      explanation: 'Strong revision combines explanation, examples, and concept links rather than rote memorization.',
      topic,
      difficulty: 'medium',
    },
    {
      question: `Which area is most helpful to revisit when learning ${topic}?`,
      options: [
        'Only the final answer',
        'Common mistakes and practical examples',
        'Unrelated topics',
        'Random textbook pages'
      ],
      correctAnswer: 1,
      explanation: 'Reviewing mistakes and examples improves understanding and retention of the topic.',
      topic,
      difficulty: 'easy',
    },
  ];

  return {
    summary,
    quickRevision,
    keyConcepts,
    flashcards,
    quiz,
  };
};

const generateRevisionPack = async (topic, notes) => {
  if (!topic || !notes || notes.trim().length < 30) {
    throw new Error('A valid topic and sufficient notes are required.');
  }

  const mockData = buildMockRevisionPack(topic, notes);

  return {
    ...mockData,
    generatedFrom: 'mock-ai-service',
  };
};

const callProvider = async (system, prompt) => {
  if (!process.env.AI_API_KEY || process.env.AI_PROVIDER === 'mock') return null;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.AI_API_KEY}` },
    body: JSON.stringify({ model: process.env.AI_MODEL || 'gpt-4o-mini', temperature: 0.4, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }] }),
  });
  if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
  const payload = await response.json();
  return JSON.parse(payload.choices?.[0]?.message?.content || '{}');
};

const teachFriend = async ({ topic, personality, explanation, notes, profile }) => {
  const providerResult = await callProvider(
    'You are a rigorous but kind study partner. Return JSON with followUp, report (accuracy, clarity, examples, conceptCoverage, handlingQuestions, overall), missingConcepts, feedback, suggestions. Score 0-100. Use only the supplied notes and explanation; challenge unsupported claims.',
    JSON.stringify({ topic, personality, explanation, notes: String(notes || '').slice(0, 10000), profile })
  );
  if (providerResult) return providerResult;
  const hasExample = /example|because|for instance|such as/i.test(explanation);
  const lengthScore = Math.min(92, 35 + Math.round(explanation.trim().length / 4));
  const overall = Math.round((lengthScore + (hasExample ? 82 : 48) + 58 + 62 + 55) / 5);
  return {
    followUp: `${personality} friend asks: how would you explain ${topic} using one concrete example, and what would change if the main condition changed?`,
    report: { accuracy: lengthScore, clarity: Math.min(95, lengthScore + 4), examples: hasExample ? 82 : 48, conceptCoverage: 62, handlingQuestions: 55, overall },
    missingConcepts: hasExample ? ['Connect the idea to a boundary case'] : ['Add a concrete example', 'Explain the condition or limitation'],
    feedback: `Your explanation has a useful starting point, but it needs stronger evidence from the notes and a clearer link between the definition and its application.`,
    suggestions: ['State the core definition first', 'Use one example and one counterexample', 'Answer the follow-up by naming the changing condition'],
  };
};

const evaluateBoss = async ({ topic, answer, question, correctAnswer, level, notes }) => {
  const providerResult = await callProvider(
    'You evaluate an adaptive academic boss battle. Return JSON with correct, damage (0-35), explanation, misconception, mastery (0-100), nextDifficulty. Do not accept an answer just because it sounds confident; ground judgment in the question, answer, and notes.',
    JSON.stringify({ topic, answer, question, correctAnswer, level, notes: String(notes || '').slice(0, 8000) })
  );
  if (providerResult) return providerResult;
  const correct = String(answer).trim().toLowerCase() === String(correctAnswer || '').trim().toLowerCase();
  return { correct, damage: correct ? (level === 'Final Boss' ? 35 : 25) : 0, explanation: correct ? `Direct hit. Your answer matches the target idea in ${topic}.` : `The gap is in the distinction between your answer and the target idea: ${correctAnswer || 'review the core definition and its application.'}`, misconception: correct ? '' : answer, mastery: correct ? 78 : 42, nextDifficulty: correct ? 'Understanding' : 'Knowledge' };
};

const createRescue = async ({ topic, notes, profile }) => {
  const providerResult = await callProvider(
    'Create a focused five-minute emergency revision session. Return JSON with priorityConcepts (array), weakAreas (array), rapidExplanation, questions (array of question, answer, explanation), readinessPrompt. Use the supplied notes/profile.',
    JSON.stringify({ topic, notes: String(notes || '').slice(0, 10000), profile })
  );
  if (providerResult) return providerResult;
  return { priorityConcepts: [`Core definition of ${topic}`, `How ${topic} works`, `Common trap in ${topic}`], weakAreas: ['Apply the concept to a new example', 'Explain why the common wrong answer fails'], rapidExplanation: `${topic} becomes easier when you connect its definition to a worked example, then test the boundary where the rule stops applying.`, questions: [{ question: `What is the core idea of ${topic}?`, answer: `State its definition and purpose in one sentence.`, explanation: 'Start with the definition before recalling details.' }, { question: `What is a common trap in ${topic}?`, answer: 'Confusing a memorized pattern with the condition that makes it valid.', explanation: 'Always name the condition and test it with an example.' }, { question: `How would you apply ${topic}?`, answer: 'Describe a concrete situation and explain each step.', explanation: 'Application reveals whether the idea is understood.' }], readinessPrompt: 'Can you explain the definition, example, and limitation without looking at your notes?' };
};

const fixMistake = async ({ topic, misconception, correction }) => {
  const providerResult = await callProvider('Return JSON with thought, correct, explanation, example, quickCheckQuestion, quickCheckAnswer. Be concise and specific.', JSON.stringify({ topic, misconception, correction }));
  if (providerResult) return providerResult;
  return { thought: misconception, correct: correction || `The accurate idea about ${topic} needs to be checked against the definition and its conditions.`, explanation: `The mistake likely treats a partial pattern as a universal rule. Compare the claim with a concrete case and identify the condition it depends on.`, example: `Use a simple example from ${topic}, then change one condition to see whether the result still holds.`, quickCheckQuestion: `What condition would make your original idea fail?`, quickCheckAnswer: 'Name the limiting condition and explain why it changes the result.' };
};

export default { generateRevisionPack, teachFriend, evaluateBoss, createRescue, fixMistake };
