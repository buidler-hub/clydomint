import api from "./api";
import "./discord";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/v1", api);

app.get('/', (req, res) => {
  res.json({ message: 'ok' })
})

app.listen(PORT, () =>
  console.log(
    `[🚀] Server running on port ${PORT} ${
      process.env.PORT ? "production" : "development"
    } mode!`
  )
);
