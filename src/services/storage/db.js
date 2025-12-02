import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.exec(`
    CREATE TABLE photos(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bucketname TEXT UNIQUE,
        filename TEXT,
        transformed BOOLEAN DEFAULT 0
    )
`);

export default db;
