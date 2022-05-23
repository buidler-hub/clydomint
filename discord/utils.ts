import { MintData, mintData } from "../data";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Message } from "discord.js";
import dotenv from "dotenv";
import { ethers } from "ethers";
import { v4 } from "uuid";

dotenv.config();

type MintFunction = {
  data: MintData;
  signature: string;
};

async function mint(
  name: string | undefined,
  description: string | undefined,
  image: string
): Promise<MintFunction | undefined> {
  try {
    const sdk = new ThirdwebSDK(
      new ethers.Wallet(
        process.env.WALLET_PRIVATE_KEY!,
        ethers.getDefaultProvider(process.env.MUMBAI_RPC)
      )
    );

    const collection = sdk.getNFTCollection(
      process.env.NFT_COLLECTION_ADDRESS!
    );
    const signedPayload = await collection.signature.generate({
      metadata: {
        name: name || "ClydoMint NFT",
        description:
          description || "Join Buidler's Hub - https://discord.gg/buidlers",
        image,
      },
    });
    const data = {
      name: name || "ClydoMint NFT",
      description:
        description || "Join Buidler's Hub - https://discord.gg/buidlers",
      image,
      signature: JSON.stringify(signedPayload),
      id: v4(),
    };
    mintData.push(data);
    return {
      data,
      signature: JSON.stringify(signedPayload),
    };
  } catch (err) {
    console.error("[🚨] Error in mint() :" + err);
    return;
  }
}

export { mint, MintFunction };
