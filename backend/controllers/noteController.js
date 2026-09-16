import asyncHandler from '../utils/asyncHandler.js';
import Note from '../models/Note.js';
import { createNote as createDemoNote, deleteNoteByIdAndUser, findNoteByIdAndUser, listNotesByUser } from '../utils/demoStore.js';
import { useMongo } from '../utils/storageMode.js';

const createNote = asyncHandler(async (req, res) => {
  const { title, content, sourceType } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required.');
  }

  const note = useMongo() ? await Note.create({
    user: req.user._id,
    title,
    content,
    sourceType: sourceType || 'paste',
  }) : createDemoNote({ userId: req.user._id, title, content, sourceType });

  res.status(201).json(note);
});

const getNotes = asyncHandler(async (req, res) => {
  const notes = useMongo() ? await Note.find({ user: req.user._id }).sort({ createdAt: -1 }) : listNotesByUser(req.user._id);
  res.json(notes);
});

const getNoteById = asyncHandler(async (req, res) => {
  const note = useMongo() ? await Note.findOne({ _id: req.params.id, user: req.user._id }) : findNoteByIdAndUser(req.params.id, req.user._id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  res.json(note);
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = useMongo() ? await Note.findOne({ _id: req.params.id, user: req.user._id }) : findNoteByIdAndUser(req.params.id, req.user._id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  if (useMongo()) await note.deleteOne();
  else deleteNoteByIdAndUser(req.params.id, req.user._id);
  res.json({ message: 'Note deleted successfully' });
});

export { createNote, getNotes, getNoteById, deleteNote };
