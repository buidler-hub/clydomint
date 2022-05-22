import { Request, Response } from "express";
import { mintData } from "../../data";

export default async function handler(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const index = mintData.findIndex((el) => el.id == id);
    if (index < 0)
      return res.status(404).json({
        message: "Mint details not found, please try signing NFT again!",
      });

    return res.json({
      message: "Data fetched successfully!",
      data: mintData[index],
    });
  } catch (err) {
    console.error("[🚨] Error in mintDetails express handler: ", err);
    return res.status(500).json({ message: "Internal server error!" });
  }
}
