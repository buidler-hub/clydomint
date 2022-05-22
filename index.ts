import dotenv from "dotenv";
dotenv.config();
import "./discord";
import express from "express";
import cors from "cors";
import api from "./api";
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/v1", api);

app.listen(PORT, () =>
  console.log(
    `[🚀] Server running on port ${PORT} ${
      process.env.PORT ? "production" : "development"
    } mode!`
  )
);
