import { client } from "./config";

export async function clickhousePing() {
  const res = await client.ping();
  console.dir(res, { depth: null });
}
