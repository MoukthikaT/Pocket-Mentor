const STORAGE_KEY_PREFIX = 'pocketMentorStudyHistory:';

const storageKey = (userId) =>
  userId ? `${STORAGE_KEY_PREFIX}${String(userId)}` : null;


/*
|--------------------------------------------------------------------------
| Read / Write
|--------------------------------------------------------------------------
*/

const readHistory = (userId) => {
  const key = storageKey(userId);
  if (!key) return [];

  try {
    const history = JSON.parse(
      localStorage.getItem(key) || '[]'
    );

    return Array.isArray(history)
      ? history
      : [];

  } catch {
    return [];
  }
};


const writeHistory = (userId, history) => {
  const key = storageKey(userId);
  if (!key) return;

  localStorage.setItem(
    key,
    JSON.stringify(history)
  );
};


/*
|--------------------------------------------------------------------------
| Create Study Pack
|--------------------------------------------------------------------------
|
| IMPORTANT:
| A study pack keeps the original user notes.
|
| This allows Quiz, Flashcards, Boss Battle and
| Rescue Mode to continue using the SAME source
| material instead of generating unrelated content.
|
*/

export const createStudyPack = ({
  note,
  material,
  userId,
}) => {

  const sourceNotes =
    note?.content ||
    note?.text ||
    note?.notes ||
    '';

  const pack = {
    id:
      note?._id ||
      note?.id ||
      `pack-${Date.now()}`,

    ownerId:
      userId,

    title:
      note?.title ||
      'Revision Pack',

    topic:
      note?.topic ||
      note?.subject ||
      note?.title ||
      'My Study Material',

    createdAt:
      new Date().toISOString(),

    /*
     * Store the exact source material.
     */
    sourceNotes,

    /*
     * Explicit marker so the frontend knows
     * this is note-based content.
     */
    noteBased:
      true,

    material:
      material || {
        summary: '',
        quickRevision: '',
        keyConcepts: [],
        flashcards: [],
        quiz: [],
      },

    attempts: [],
  };


  const history =
    readHistory(userId).filter(
      (item) =>
        item.id !== pack.id
    );

  writeHistory(userId, [
    pack,
    ...history,
  ]);

  return pack;
};


/*
|--------------------------------------------------------------------------
| Get Study Packs
|--------------------------------------------------------------------------
*/

export const getStudyPacks = (userId) =>
  readHistory(userId);


export const getStudyPack = (
  id,
  userId
) =>
  readHistory(userId).find(
    (pack) =>
      String(pack.id) ===
      String(id)
  );


/*
|--------------------------------------------------------------------------
| Get Source Notes
|--------------------------------------------------------------------------
|
| Used by Quiz / Boss Battle / Rescue Mode.
|
*/

export const getStudyPackNotes = (
  id,
  userId
) => {
  const pack =
    getStudyPack(id, userId);

  return (
    pack?.sourceNotes ||
    ''
  );
};


/*
|--------------------------------------------------------------------------
| Save Quiz Attempt
|--------------------------------------------------------------------------
*/

export const saveQuizAttempt = (
  packId,
  attempt,
  userId
) => {

  const history =
    readHistory(userId);

  writeHistory(userId,
    history.map(
      (pack) => {

        if (
          String(pack.id) !==
          String(packId)
        ) {
          return pack;
        }

        const attempts =
          pack.attempts ||
          [];

        /*
         * Prevent duplicate attempts.
         */
        const alreadySaved =
          attempts.some(
            (item) =>
              item.id ===
              attempt.id
          );

        if (
          alreadySaved
        ) {
          return pack;
        }

        return {
          ...pack,

          attempts: [
            {
              ...attempt,

              completedAt:
                new Date().toISOString(),

              /*
               * Keep the attempt connected
               * to note-based material.
               */
              noteBased:
                true,
            },

            ...attempts,
          ],
        };
      }
    )
  );
};


/*
|--------------------------------------------------------------------------
| Save Individual Mistake
|--------------------------------------------------------------------------
|
| Keeps sourceNote when available.
|
*/

export const saveMistake = (
  packId,
  mistake,
  userId
) => {

  const history =
    readHistory(userId);

  writeHistory(userId,
    history.map(
      (pack) => {

        if (
          String(pack.id) !==
          String(packId)
        ) {
          return pack;
        }

        return {
          ...pack,

          mistakes: [
            ...(pack.mistakes ||
              []),

            {
              ...mistake,

              sourceNote:
                mistake.sourceNote ||
                '',

              createdAt:
                new Date().toISOString(),
            },
          ],
        };
      }
    )
  );
};


/*
|--------------------------------------------------------------------------
| Dashboard Stats
|--------------------------------------------------------------------------
*/

export const getDashboardStats = (
  userId
) => {

  const packs =
    readHistory(userId).filter(
      (pack) =>
        !userId ||
        pack.ownerId ===
          userId
    );

  const attempts =
    packs.flatMap(
      (pack) =>
        pack.attempts || []
    );

  const averageScore =
    attempts.length
      ? Math.round(
          attempts.reduce(
            (
              total,
              attempt
            ) =>
              total +
              Number(
                attempt.percentage ||
                  0
              ),
            0
          ) /
            attempts.length
        )
      : 0;


  /*
   * Find repeated weak topics.
   *
   * We prefer the topic supplied with the
   * question instead of inventing one.
   */
  const weakTopics =
    Object.values(
      attempts
        .flatMap(
          (attempt) =>
            attempt
              .incorrectQuestions ||
            []
        )
        .reduce(
          (
            topics,
            question
          ) => {

            const topic =
              question.topic ||
              question.sourceTopic ||
              'Needs review';

            if (
              !topics[topic]
            ) {
              topics[topic] = {
                topic,

                missed: 0,

                packId:
                  question.packId,

                sourceNote:
                  question.sourceNote ||
                  '',
              };
            }

            topics[
              topic
            ].missed += 1;

            return topics;
          },
          {}
        )
    )
    .sort(
      (a, b) =>
        b.missed -
        a.missed
    );


  return {
    packs,

    attempts,

    averageScore,

    weakTopics,
  };
};


/*
|--------------------------------------------------------------------------
| Clear History
|--------------------------------------------------------------------------
*/

export const clearStudyHistory = (userId) => {
  const key = storageKey(userId);
  if (key) localStorage.removeItem(key);
};


/*
|--------------------------------------------------------------------------
| Export helpers
|--------------------------------------------------------------------------
*/

export {
  readHistory,
};