import express from "express";
import mintDetailsHandler from "./modules/mintDetails";
const router = express.Router();

router.get("/mintdetails/:id", mintDetailsHandler);

export default router;
