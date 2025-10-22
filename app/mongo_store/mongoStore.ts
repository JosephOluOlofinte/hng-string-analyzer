import StringRecord, { iStringRecord } from '../models/strings.model';

export type RecordType = {
  id: string;
  value: string;
  properties: any;
  created_at: string;
};

async function getAll(): Promise<RecordType[]> {
  const docs = await StringRecord.find().lean().exec();
  return docs.map((d) => ({
    id: d.id,
    value: d.value,
    properties: d.properties,
    created_at: d.created_at.toISOString(),
  }));
}

async function getById(id: string): Promise<RecordType | undefined> {
  const d = await StringRecord.findOne({ id }).lean().exec();
  if (!d) return undefined;
  return {
    id: d.id,
    value: d.value,
    properties: d.properties,
    created_at: d.created_at.toISOString(),
  };
}

async function save(record: RecordType): Promise<void> {
  // upsert behavior is useful but spec expects 409 on duplicate,
  // so use create and let caller handle duplicate errors
  const doc = new StringRecord({
    id: record.id,
    value: record.value,
    properties: record.properties,
    created_at: new Date(record.created_at),
  });
  await doc.save();
}

async function removeById(id: string): Promise<void> {
  await StringRecord.deleteOne({ id }).exec();
}

export default {
  getAll,
  getById,
  save,
  removeById,
};
