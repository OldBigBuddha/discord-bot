import { kv } from "@storage/kv";

const KEY_NICE = "nice_key" as const;

async function findEntry<T>(
  keys: Deno.KvKeyPart[],
): Promise<Deno.KvEntryMaybe<T> | undefined> {
  return await kv.get<T>([KEY_NICE, ...keys]);
}

async function setEntry(
  keys: Deno.KvKeyPart[],
  value: number,
): Promise<Deno.KvCommitResult> {
  return await kv.set([KEY_NICE, ...keys], value);
}

/**
 * 指定されたユーザーの nice point をインクリメントする
 */
export async function niceTo(targetId: string): Promise<number> {
  const entry = await findEntry<number>([targetId]);
  const newPoint = entry?.value != null ? entry.value + 1 : 1;
  await setEntry([targetId], newPoint);

  return newPoint;
}
