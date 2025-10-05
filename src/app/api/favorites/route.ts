import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { promises as fs } from "fs";
import path from "path";

type FavItem = {
  id?: string | number;
  name?: string;
  desc?: string;
  url?: string;
  thumb?: string;
  tags?: string[];
  views?: number;
  pricing?: string;
  updatedAt?: string;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "favorites.json");

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE).catch(async () => {
      await fs.writeFile(DATA_FILE, JSON.stringify({}), "utf-8");
    });
  } catch (e) {
    // ignore
  }
}

async function readStore(): Promise<Record<string, FavItem[]>> {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const json = JSON.parse(raw);
    return typeof json === "object" && json ? json : {};
  } catch {
    return {};
  }
}

async function writeStore(data: Record<string, FavItem[]>) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function getUserKey(session: any): string | undefined {
  const email = session?.user?.email;
  const sub = session?.user?.id || (session as any)?.sub;
  return email || sub || undefined;
}

export async function GET() {
  const session = await getServerSession(authOptions as any);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const key = getUserKey(session)!;
  const store = await readStore();
  const list = Array.isArray(store[key]) ? store[key] : [];
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const key = getUserKey(session)!;
  const payload = (await req.json()) as FavItem;
  if (!payload || !payload.id) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const store = await readStore();
  const list = Array.isArray(store[key]) ? store[key] : [];
  const exists = list.find((x) => String(x.id) === String(payload.id));
  if (!exists) list.push(payload);
  store[key] = list;
  await writeStore(store);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const key = getUserKey(session)!;
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const store = await readStore();
  const list = Array.isArray(store[key]) ? store[key] : [];
  const next = list.filter((x) => String(x.id) !== String(id));
  store[key] = next;
  await writeStore(store);
  return NextResponse.json({ success: true });
}