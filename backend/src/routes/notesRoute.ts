import express from "express";

//# To import all the functions notesControllers as ....
import * as notesController from "../controllers/notesControllers";

const router = express.Router();

router.get("/", notesController.getNotes);
router.get("/:noteId", notesController.getNote);
router.post("/", notesController.createNote);
router.patch("/:noteId", notesController.updateNote);
router.delete("/:noteId", notesController.deleteNote);
export default router;
