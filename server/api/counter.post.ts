import { kv } from "@vercel/kv";

export default defineEventHandler(async () => {
  const current = await kv.get("counter");

  const res = await kv.set("counter", Number(current) + 1);

  return res;
});
