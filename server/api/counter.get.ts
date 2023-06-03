import { kv } from "@vercel/kv";

export default defineEventHandler(async () => {
  const current = await kv.get("counter");

  

  return current ?? 0;
});
