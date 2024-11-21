import { RequestHandler } from "express";
import noteModel from "../models/noteModel";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    //throw Error("Oops!, An Error Occured.");
    const notes = await noteModel.find().exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, " INvalid Note Id.");
    }
    const note = await noteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not Found.");
    }
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

interface createNoteBody {
  title?: string;
  text?: string;
}

export const createNote: RequestHandler<
  unknown,
  unknown,
  createNoteBody,
  unknown
> = async (req, res, next) => {
  const { title, text } = req.body;

  try {
    if (!title) {
      throw createHttpError(400, "Note must have a title");
    }
    const newNote = await noteModel.create({
      title: title,
      text: text,
    });
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

//! function to update the note
interface updateNOteParams {
  noteId: string;
}
interface updateNoteBody {
  title?: string;
  text?: string;
}

export const updateNote: RequestHandler<
  updateNOteParams,
  unknown,
  updateNoteBody,
  unknown
> = async (req, res, next) => {
  const noteId = req.params.noteId;
  const newTitle = req.body.title;
  const newtext = req.body.text;
  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, " INvalid Note Id.");
    }

    if (!newTitle) {
      throw createHttpError(400, "Note must have a title");
    }

    const note = await noteModel.findById(noteId).exec();
    if (!note) {
      throw createHttpError(404, "Note not Found.");
    }

    note.title = newTitle;
    note.text = newtext;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

//! delete note
export const deleteNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, " INvalid Note Id.");
    }

    const note = await noteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not Found.");
    }

    await note.deleteOne({ _id: noteId });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
