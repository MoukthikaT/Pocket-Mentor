const demoStore = {
  users: [],
  notes: [],
  studyMaterials: [],
  learningRecords: [],
};

const createId = () => Math.random().toString(36).slice(2, 11);

const findUserByEmail = (email) => demoStore.users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());

const findUserById = (id) => demoStore.users.find((user) => String(user._id) === String(id));

const createUser = ({ name, email, password }) => {
  const user = {
    _id: createId(),
    name,
    email: String(email).toLowerCase(),
    password,
    profile: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  demoStore.users.push(user);
  return user;
};

const createNote = ({ userId, title, content, sourceType }) => {
  const note = {
    _id: createId(),
    user: userId,
    title,
    content,
    sourceType: sourceType || 'paste',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  demoStore.notes.push(note);
  return note;
};

const listNotesByUser = (userId) => demoStore.notes.filter((note) => String(note.user) === String(userId)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

const findNoteByIdAndUser = (id, userId) => demoStore.notes.find((note) => String(note._id) === String(id) && String(note.user) === String(userId));

const deleteNoteByIdAndUser = (id, userId) => {
  const noteIndex = demoStore.notes.findIndex((note) => String(note._id) === String(id) && String(note.user) === String(userId));
  if (noteIndex === -1) return null;
  const [removed] = demoStore.notes.splice(noteIndex, 1);
  return removed;
};

const saveStudyMaterial = ({ userId, noteId, topic, material }) => {
  const record = {
    _id: createId(),
    user: userId,
    note: noteId,
    topic,
    summary: material.summary,
    quickRevision: material.quickRevision,
    keyConcepts: material.keyConcepts,
    flashcards: material.flashcards,
    quiz: material.quiz,
    createdAt: new Date().toISOString(),
  };
  demoStore.studyMaterials.push(record);
  return record;
};

export {
  demoStore,
  findUserByEmail,
  findUserById,
  createUser,
  createNote,
  listNotesByUser,
  findNoteByIdAndUser,
  deleteNoteByIdAndUser,
  saveStudyMaterial,
};
