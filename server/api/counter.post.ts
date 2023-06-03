import { kv } from "@vercel/kv";

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const current = await kv.get("counter");

  const res = await kv.set("counter", Number(current) + +body ?? 0);

  return res
});
