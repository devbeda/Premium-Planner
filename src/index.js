import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";
import userRouter from "./routes/user.routes.js";
import clientRouter from "./routes/client.routes.js";

dotenv.config({
  path: "./env",
});

const app = express();
app.use(
  cors({
    origin: "https://premiumplanner-8b54wtabz-beda-prakash-sahus-projects.vercel.app",
    credentials: true,
    // Add other headers if needed.  //
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/user", userRouter);
app.use("/client", clientRouter);

connectDB()
  .then(
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server listening on ${process.env.Port}`);
    })
  )
  .catch((err) => {
    console.log("MongoDB connection failed: " + err.message);
  });
