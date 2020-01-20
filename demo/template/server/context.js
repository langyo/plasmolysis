import lowdb from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';
import { resolve } from 'path';
import { parse as YAMLParse, stringify as YAMLStringify } from 'yaml';

export const db = lowdb(new FileAsync(resolve('../data.yaml'), {
  serialize: obj => YAMLStringify(obj),
  deserialize: str => YAMLParse(str),
  defaultValue: {
    accounts: [],
    notes: [],
    tags: []
  }
}));

