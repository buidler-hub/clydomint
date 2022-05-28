import dotenv from "dotenv";

dotenv.config();

const supportedNetworks = new Map<string, string>([
  ["mumbai", process.env.MUMBAI_RPC as string],
  ["polygon", process.env.POLYGON_RPC as string],
]);

export { supportedNetworks };
