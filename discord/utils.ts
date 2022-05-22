import dotenv from "dotenv";
dotenv.config();
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Message, MessageAttachment } from "discord.js";
import { ethers } from "ethers";
import { MintData, mintData } from "../data";
import { v4 } from "uuid";

type MintFunction = {
  data: MintData;
  signature: string;
};

function attachIsImage(msgAttach: MessageAttachment): boolean {
  var url = msgAttach.url;
  // True if this url is a png image.
  return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1;
}

async function mint(
  name: string | undefined,
  description: string | undefined,
  image: string,
  message?: Message
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

export { attachIsImage, mint, MintFunction };
