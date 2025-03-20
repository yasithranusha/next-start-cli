/* eslint-disable @typescript-eslint/no-explicit-any */
import Datastore from "nedb";
import { promisify } from "util";
import { Item } from "./../types/db";

type InsertAsync = (doc: Item) => Promise<Item>;
type FindAsync = (query: Partial<Item>) => Promise<Item[]>;
type FindOneAsync = (query: Partial<Item>) => Promise<Item | null>;
type UpdateAsync = (
  query: Partial<Item>,
  update: Partial<Item>,
  options?: Nedb.UpdateOptions
) => Promise<number>;
type RemoveAsync = (
  query: Partial<Item>,
  options?: Nedb.RemoveOptions
) => Promise<number>;

class TypedDatastore extends Datastore<Item> {
  insertAsync!: InsertAsync;
  findAsync!: FindAsync;
  findOneAsync!: FindOneAsync;
  updateAsync!: UpdateAsync;
  removeAsync!: RemoveAsync;
}

// Create database instance with proper path resolution
const db = new TypedDatastore({
  filename: `${process.cwd()}/data.db`,
  autoload: true,
});

// Correctly promisify methods with proper typing
db.insertAsync = promisify(
  (doc: Item, callback: (err: Error | null, doc: Item) => void) =>
    db.insert(doc, callback)
);

db.findAsync = promisify(
  (query: Partial<Item>, callback: (err: Error | null, docs: Item[]) => void) =>
    db.find(query, callback)
);

db.findOneAsync = promisify(
  (
    query: Partial<Item>,
    callback: (err: Error | null, doc: Item | null) => void
  ) => db.findOne(query, callback)
);

db.updateAsync = promisify(
  (
    query: Partial<Item>,
    update: Partial<Item>,
    options: Nedb.UpdateOptions | undefined,
    callback: (err: Error | null, numAffected: number) => void
  ) => db.update(query, update, options || {}, callback)
);

db.removeAsync = promisify(
  (
    query: Partial<Item>,
    options: Nedb.RemoveOptions | undefined,
    callback: (err: Error | null, numRemoved: number) => void
  ) => db.remove(query, options || {}, callback)
);

export default db;


/**
 * To remove neDB and backend dependecies, we can use the following code:
 * yarn remove bcrypt neDB @types/bcrypt @types/neDB
 * */