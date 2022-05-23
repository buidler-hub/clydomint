import mintDetailsHandler from "./modules/mintDetails";
import express from "express";

const router = express.Router();

router.get("/mintdetails/:id", mintDetailsHandler);

export default router;
