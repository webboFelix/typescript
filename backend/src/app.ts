import "dotenv/config";
import morgan from "morgan";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import env from "./util/validateEnv";

import { requiresAuth } from "./middleware/auth";

//import noteModel from "./models/noteModel";
import notesRoutes from "./routes/notesRoute";
import userRoutes from "./routes/userRoute";

import createHttpError, { isHttpError } from "http-errors";

const app = express();

//! morgan helps to print all the end points you visit on the console for easy tracking of the error.
app.use(morgan("dev"));

//!This helps to pass data as json
app.use(express.json());

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGODB_URL,
    }),
  })
);

app.use("/api/users", userRoutes);
app.use("/api/notes", requiresAuth, notesRoutes);

//^ if you access an end point that doesn't exist.
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not Found."));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  let errorMessage = "An Unknown error occured.";

  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
