import Database from 'better-sqlite3';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const dbPath = process.env.DATABASE_URL?.replace('file:', '') || path.resolve(process.cwd(), 'dev.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

const categorias = [
  { id: 'mujer', name: 'Mujer', slug: 'mujer', icon: '👗' },
  { id: 'hombre', name: 'Hombre', slug: 'hombre', icon: '👔' },
  { id: 'ninos', name: 'Niños/as', slug: 'ninos', icon: '🧒' },
];

const productos = [
  // =====================
  // MUJER - 10 productos
  // =====================
  { 
    name: 'Jean Mom Azul Denim', 
    description: 'Jean mom fit en azul denim, tiro alto super favorecedor.', 
    price: 35000, 
    stock: 8, 
    categoryId: 'mujer', 
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop', 
    talles: '34,36,38,40,42' 
  },
  { 
    name: 'Remera Oversize Blanca', 
    description: 'Remera oversize en blanco puro, algodón 100%.', 
    price: 15000, 
    stock: 15, 
    categoryId: 'mujer', 
    imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=500&fit=crop', 
    talles: 'S,M,L,XL' 
  },
  { 
    name: 'Vestido Midi Estampado', 
    description: 'Vestido midi con estampado floral, perfecto para cualquier ocasión.', 
    price: 48000, 
    stock: 5, 
    categoryId: 'mujer', 
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop', 
    talles: 'S,M,L,XL' 
  },
  { 
    name: 'Campera Jean Oversize', 
    description: 'Campera de jean oversize en wash oscuro. Tendencia pura.', 
    price: 58000, 
    stock: 6, 
    categoryId: 'mujer', 
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop', 
    talles: 'S,M,L' 
  },
  { 
    name: 'Buzo Canguro Rosa Palo', 
    description: 'Buzo canguro en rosa palo, súper suave. El color del momento.', 
    price: 40000, 
    stock: 10, 
    categoryId: 'mujer', 
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop', 
    talles: 'S,M,L,XL' 
  },
  { 
    name: 'Top Rib Crudo', 
    description: 'Top rib en color crudo, perfecto para usar solo o debajo.', 
    price: 12000, 
    stock: 12, 
    categoryId: 'mujer', 
    imageUrl: 'https://images.unsplash.com/photo-1485968579169-e6d3e1e32c28?w=400&h=500&fit=crop', 
    talles: 'S,M,L' 
  },
  { 
    name: 'Pollera Midi Plisada', 
    description: 'Pollera midi plisada, largo ideal que sienta bien con todo.', 
    price: 28000, 
    stock: 7, 
    categoryId: 'mujer', 
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop', 
    talles: 'S,M,L,XL' 
  },
  { 
    name: 'Short Jean Blanco', 
    description: 'Short de jean blanco, tiro alto con roturas.', 
    price: 22000, 
    stock: 8, 
    categoryId: 'mujer', 
    imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop', 
    talles: '34,36,38,40' 
  },
  { 
    name: 'Vestido Negro Elegante', 
    description: 'Vestido negro elegante para fiestas y eventos especiales.', 
    price: 55000, 
    stock: 4, 
    categoryId: 'mujer', 
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop', 
    talles: 'S,M,L' 
  },
  { 
    name: 'Camisa Seda Rosa', 
    description: 'Camisa de seda en rosa, súper elegante para ocasiones especiales.', 
    price: 38000, 
    stock: 6, 
    categoryId: 'mujer', 
    imageUrl: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=500&fit=crop', 
    talles: 'S,M,L,XL' 
  },

  // =====================
  // HOMBRE - 10 productos
  // =====================
  { 
    name: 'Remera Lisa Blanca Premium', 
    description: 'Remera blanca lisa en algodón premium, corte clásico.', 
    price: 16000, 
    stock: 20, 
    categoryId: 'hombre', 
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop', 
    talles: 'S,M,L,XL,XXL' 
  },
  { 
    name: 'Jean Slim Negro', 
    description: 'Jean slim fit en negro, elastizado para mayor comodidad.', 
    price: 38000, 
    stock: 10, 
    categoryId: 'hombre', 
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop', 
    talles: '38,40,42,44,46' 
  },
  { 
    name: 'Buzo Hoodie Negro', 
    description: 'Buzo con capucha en negro, tela gruesa para el frío.', 
    price: 52000, 
    stock: 8, 
    categoryId: 'hombre', 
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop', 
    talles: 'S,M,L,XL,XXL' 
  },
  { 
    name: 'Jogger Cargo Negro', 
    description: 'Jogger cargo en negro con bolsillos laterales.', 
    price: 32000, 
    stock: 12, 
    categoryId: 'hombre', 
    imageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=500&fit=crop', 
    talles: 'S,M,L,XL,XXL' 
  },
  { 
    name: 'Remera Estampada', 
    description: 'Remera con estampado moderno. Para los que buscan destacar.', 
    price: 20000, 
    stock: 10, 
    categoryId: 'hombre', 
    imageUrl: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=400&h=500&fit=crop', 
    talles: 'S,M,L,XL' 
  },
  { 
    name: 'Camisa Oxford Celeste', 
    description: 'Camisa oxford en celeste, formal o casual.', 
    price: 28000, 
    stock: 8, 
    categoryId: 'hombre', 
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop', 
    talles: 'S,M,L,XL' 
  },
  { 
    name: 'Buzo Quarter Zip Marino', 
    description: 'Buzo quarter zip en azul marino, super abrigado.', 
    price: 45000, 
    stock: 6, 
    categoryId: 'hombre', 
    imageUrl: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=400&h=500&fit=crop', 
    talles: 'M,L,XL,XXL' 
  },
  { 
    name: 'Jean Clásico Azul', 
    description: 'Jean clásico en azul lavado, corte regular fit.', 
    price: 36000, 
    stock: 10, 
    categoryId: 'hombre', 
    imageUrl: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&h=500&fit=crop', 
    talles: '38,40,42,44,46,48' 
  },
  { 
    name: 'Remera Negra Oversize', 
    description: 'Remera negra oversize, básico que no puede faltar.', 
    price: 17000, 
    stock: 15, 
    categoryId: 'hombre', 
    imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=500&fit=crop', 
    talles: 'S,M,L,XL,XXL' 
  },
  { 
    name: 'Campera Cuero Negro', 
    description: 'Campera de cuero sintético en negro. Super estilosa.', 
    price: 65000, 
    stock: 5, 
    categoryId: 'hombre', 
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop', 
    talles: 'M,L,XL' 
  },

  // =====================
  // NIÑOS - 10 productos
  // =====================
  { 
    name: 'Remera Estampada Niños', 
    description: 'Remera estampada para niños, diseños divertidos.', 
    price: 9500, 
    stock: 12, 
    categoryId: 'ninos', 
    imageUrl: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&h=500&fit=crop', 
    talles: '4,6,8,10,12' 
  },
  { 
    name: 'Jean Niño Azul', 
    description: 'Jean para niños en azul, resistente para todo uso.', 
    price: 18000, 
    stock: 8, 
    categoryId: 'ninos', 
    imageUrl: 'https://images.unsplash.com/photo-1543853645-b69c2c0f6a7a?w=400&h=500&fit=crop', 
    talles: '4,6,8,10,12' 
  },
  { 
    name: 'Buzo Canguro Infantil', 
    description: 'Buzo canguro infantil, súper abrigado para el frío.', 
    price: 24000, 
    stock: 10, 
    categoryId: 'ninos', 
    imageUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop', 
    talles: '4,6,8,10,12' 
  },
  { 
    name: 'Short Jean Niño', 
    description: 'Short de jean para nenes, ideal para el verano.', 
    price: 14000, 
    stock: 10, 
    categoryId: 'ninos', 
    imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop', 
    talles: '4,6,8,10,12' 
  },
  { 
    name: 'Vestido Niña Floral', 
    description: 'Vestido con estampado floral para niñas, adorable.', 
    price: 26000, 
    stock: 6, 
    categoryId: 'ninos', 
    imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=500&fit=crop', 
    talles: '2,4,6,8,10' 
  },
  { 
    name: 'Remera Básica Blanca Niño', 
    description: 'Remera básica en blanco para niños.', 
    price: 8500, 
    stock: 15, 
    categoryId: 'ninos', 
    imageUrl: 'https://images.unsplash.com/photo-1485968579169-e6d3e1e32c28?w=400&h=500&fit=crop', 
    talles: '2,4,6,8,10,12,14' 
  },
  { 
    name: 'Campera Impermeable', 
    description: 'Campera impermeable con capucha para niños.', 
    price: 32000, 
    stock: 6, 
    categoryId: 'ninos', 
    imageUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop', 
    talles: '4,6,8,10,12' 
  },
  { 
    name: 'Leggin Algodón Niña', 
    description: 'Leggin de algodón stretch, súper cómodo.', 
    price: 11000, 
    stock: 10, 
    categoryId: 'ninos', 
    imageUrl: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&h=500&fit=crop', 
    talles: '2,4,6,8,10' 
  },
  { 
    name: 'Jean Morado Niño', 
    description: 'Jean en color morado para niños, súper moderno.', 
    price: 19000, 
    stock: 7, 
    categoryId: 'ninos', 
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop', 
    talles: '4,6,8,10,12' 
  },
  { 
    name: 'Conjunto Deportivo Niño', 
    description: 'Conjunto deportivo completo para niños. Ideal para el cole.', 
    price: 28000, 
    stock: 8, 
    categoryId: 'ninos', 
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop', 
    talles: '4,6,8,10,12' 
  },
];

function seed() {
  console.log('🌱 Seed de productos...\n');

  db.pragma('foreign_keys = OFF');
  
  const transaction = db.transaction(() => {
    // Limpiar productos existentes
    db.prepare('DELETE FROM Product').run();
    
    // Insertar categorías
    const insertCategory = db.prepare(`
      INSERT OR REPLACE INTO Category (id, name, slug, icon, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    for (const cat of categorias) {
      insertCategory.run(cat.id, cat.name, cat.slug, cat.icon);
    }

    // Insertar productos
    const insertProduct = db.prepare(`
      INSERT INTO Product (id, name, description, price, stock, categoryId, imageUrl, talles, estado, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'disponible', datetime('now'), datetime('now'))
    `);

    for (const prod of productos) {
      insertProduct.run(
        crypto.randomUUID(), 
        prod.name, 
        prod.description, 
        prod.price, 
        prod.stock, 
        prod.categoryId, 
        prod.imageUrl, 
        prod.talles
      );
    }

    // Resumen
    const byCategory = db.prepare(`
      SELECT c.name, COUNT(p.id) as count 
      FROM Category c 
      LEFT JOIN Product p ON c.id = p.categoryId 
      GROUP BY c.id
    `).all() as { name: string; count: number }[];

    console.log('📂 Por categoría:');
    for (const row of byCategory) {
      console.log(`   ${row.name}: ${row.count} productos`);
    }
    console.log('\n✅ Seed completado!');
    console.log(`📦 Total: ${productos.length} productos`);
  });

  transaction();
}

seed();
