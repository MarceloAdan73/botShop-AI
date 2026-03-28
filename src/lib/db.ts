import Database from 'better-sqlite3';
import path from 'path';

import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const dbPath = process.env.DATABASE_URL?.replace('file:', '') || path.resolve(process.cwd(), 'dev.db');

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const runSafely = (sql: string) => {
  try {
    db.exec(sql);
  } catch (e: any) {
    if (!e.message.includes('duplicate column') && !e.message.includes('already exists')) {
      console.error('DB Error:', e.message);
    }
  }
};

runSafely(`
  CREATE TABLE IF NOT EXISTS Category (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    destacados TEXT,
    rangosPrecio TEXT,
    talles TEXT,
    nota TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

runSafely(`
  CREATE TABLE IF NOT EXISTS Product (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    categoryId TEXT NOT NULL,
    imageUrl TEXT,
    talles TEXT,
    estado TEXT DEFAULT 'disponible',
    reserva_info TEXT,
    venta_info TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES Category(id)
  )
`);

runSafely(`
  CREATE TABLE IF NOT EXISTS Config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    storeInfo TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

runSafely(`
  CREATE TABLE IF NOT EXISTS Conversation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_cliente TEXT,
    telefono_cliente TEXT,
    fecha_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_mensajes INTEGER DEFAULT 0,
    necesita_atencion BOOLEAN DEFAULT 0,
    resumen TEXT,
    mensajes TEXT,
    userInfo TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

runSafely(`
  CREATE TABLE IF NOT EXISTS Venta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id TEXT NOT NULL,
    nombre_cliente TEXT,
    telefono_cliente TEXT,
    metodo_pago TEXT,
    precio_venta REAL,
    nota TEXT,
    fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES Product(id)
  )
`);

runSafely(`
  CREATE TABLE IF NOT EXISTS Reserva (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id TEXT NOT NULL,
    nombre_cliente TEXT NOT NULL,
    telefono_cliente TEXT,
    fecha_reserva DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento DATETIME,
    nota TEXT,
    estado TEXT DEFAULT 'activa',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES Product(id)
  )
`);

runSafely(`ALTER TABLE Product ADD COLUMN estado TEXT DEFAULT 'disponible'`);
runSafely(`ALTER TABLE Product ADD COLUMN reserva_info TEXT`);
runSafely(`ALTER TABLE Product ADD COLUMN venta_info TEXT`);

export default db;
