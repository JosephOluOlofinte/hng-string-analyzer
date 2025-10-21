import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'strings.json');

type RecordType = {
  id: string;
  value: string;
  properties: any;
  created_at: string;
};

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([]), 'utf8');
  }
}

function readAll(): RecordType[] {
  ensureFile();
  const raw = fs.readFileSync(FILE_PATH, 'utf8');
  try {
    return JSON.parse(raw) as RecordType[];
  } catch {
    return [];
  }
}

function writeAll(items: RecordType[]) {
  ensureFile();
  fs.writeFileSync(FILE_PATH, JSON.stringify(items, null, 2), 'utf8');
}

function getAll(): RecordType[] {
  return readAll();
}

function getById(id: string): RecordType | undefined {
  return readAll().find((r) => r.id === id);
}

function save(record: RecordType) {
  const items = readAll();
  items.push(record);
  writeAll(items);
}

function removeById(id: string) {
  const items = readAll().filter((r) => r.id !== id);
  writeAll(items);
}

export default {
  getAll,
  getById,
  save,
  removeById,
};

export type { RecordType };
