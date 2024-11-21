import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

const port = env.PORT;
const mongoUrl = env.MONGODB_URL;

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Mongodb connected");
    app.listen(port, () => {
      console.log("Server running on port: ", port);
    });
  })
  .catch(console.error);
