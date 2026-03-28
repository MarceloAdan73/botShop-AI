import db from './db';

const parseJson = (val: string | null) => val ? JSON.parse(val) : null;

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  destacados?: any;
  rangosPrecio?: any;
  talles?: string;
  nota?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductoEstado = 'disponible' | 'reservado' | 'vendido';

export interface ReservaInfo {
  nombreCliente: string;
  telefonoCliente?: string;
  fechaReserva: string;
  fechaVencimiento?: string;
  reservaId?: number;
}

export interface VentaInfo {
  nombreCliente: string;
  telefonoCliente?: string;
  fechaVenta: string;
  metodoPago?: string;
  precioVenta?: number;
  ventaId?: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrl?: string;
  talles?: string;
  estado: ProductoEstado;
  reservaInfo?: ReservaInfo | null;
  ventaInfo?: VentaInfo | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Config {
  id: number;
  storeInfo: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: number;
  nombreCliente?: string;
  telefonoCliente?: string;
  fechaInicio: Date;
  totalMensajes: number;
  necesitaAtencion: boolean;
  resumen?: string;
  mensajes?: any;
  userInfo?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Venta {
  id: number;
  productoId: string;
  nombreCliente?: string;
  telefonoCliente?: string;
  metodoPago?: string;
  precioVenta?: number;
  nota?: string;
  fechaVenta: Date;
  createdAt: Date;
  updatedAt: Date;
  producto?: Product | null;
}

export interface Reserva {
  id: number;
  productoId: string;
  nombreCliente: string;
  telefonoCliente?: string;
  fechaReserva: Date;
  fechaVencimiento?: Date;
  nota?: string;
  estado: 'activa' | 'completada' | 'cancelada' | 'vencida';
  createdAt: Date;
  updatedAt: Date;
  producto?: Product | null;
}

export class CategoryModel {
  static findAll(): Category[] {
    const stmt = db.prepare('SELECT * FROM Category ORDER BY name');
    const rows = stmt.all() as any[];
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      icon: row.icon,
      destacados: parseJson(row.destacados),
      rangosPrecio: parseJson(row.rangos_precio),
      talles: row.talles,
      nota: row.nota,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));
  }

  static findBySlug(slug: string): Category | null {
    const stmt = db.prepare('SELECT * FROM Category WHERE slug = ?');
    const row = stmt.get(slug) as any;
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      icon: row.icon,
      destacados: parseJson(row.destacados),
      rangosPrecio: parseJson(row.rangos_precio),
      talles: row.talles,
      nota: row.nota,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  static findById(id: string): Category | null {
    const stmt = db.prepare('SELECT * FROM Category WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      icon: row.icon,
      destacados: parseJson(row.destacados),
      rangosPrecio: parseJson(row.rangos_precio),
      talles: row.talles,
      nota: row.nota,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
  
  static create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const stmt = db.prepare(
      'INSERT INTO Category (id, name, slug, icon, destacados, rangosPrecio, talles, nota, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    stmt.run(
      id, data.name, data.slug, data.icon, 
      JSON.stringify(data.destacados), JSON.stringify(data.rangosPrecio), 
      data.talles, data.nota, now, now
    );
    return { ...data, id, createdAt: new Date(now), updatedAt: new Date(now) };
  }
  
  static update(id: string, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): void {
    const now = new Date().toISOString();
    const stmt = db.prepare(
      `UPDATE Category SET 
       name = COALESCE(?, name), 
       slug = COALESCE(?, slug), 
       icon = COALESCE(?, icon),
       destacados = COALESCE(?, destacados),
       rangosPrecio = COALESCE(?, rangosPrecio),
       talles = COALESCE(?, talles),
       nota = COALESCE(?, nota),
       updatedAt = ?
       WHERE id = ?`
    );
    stmt.run(
      data.name, data.slug, data.icon,
      JSON.stringify(data.destacados), JSON.stringify(data.rangosPrecio),
      data.talles, data.nota,
      now, id
    );
  }

  static delete(id: string): { success: boolean; productCount?: number } {
    const products = ProductModel.findByCategory(id);
    if (products.length > 0) {
      return { success: false, productCount: products.length };
    }
    const stmt = db.prepare('DELETE FROM Category WHERE id = ?');
    stmt.run(id);
    return { success: true };
  }

  static getProductCount(id: string): number {
    return ProductModel.findByCategory(id).length;
  }
}

export class ProductModel {
  static findByCategory(categoryId: string): Product[] {
    const stmt = db.prepare('SELECT * FROM Product WHERE categoryId = ? ORDER BY name');
    const rows = stmt.all(categoryId) as any[];
    return rows.map(this.mapRow);
  }

  static findAll(): Product[] {
    const stmt = db.prepare('SELECT * FROM Product ORDER BY createdAt DESC');
    const rows = stmt.all() as any[];
    return rows.map(this.mapRow);
  }

  static findByEstado(estado: ProductoEstado): Product[] {
    const stmt = db.prepare('SELECT * FROM Product WHERE estado = ? ORDER BY createdAt DESC');
    const rows = stmt.all(estado) as any[];
    return rows.map(this.mapRow);
  }

  static findById(id: string): Product | null {
    const stmt = db.prepare('SELECT * FROM Product WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return this.mapRow(row);
  }

  static findByIdWithCategory(id: string): (Product & { category?: Category }) | null {
    const product = this.findById(id);
    if (!product) return null;
    return {
      ...product,
      category: CategoryModel.findById(product.categoryId) ?? undefined
    };
  }

  private static mapRow(row: any): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      stock: row.stock !== undefined ? Number(row.stock) : 0,
      categoryId: row.categoryId,
      imageUrl: row.imageUrl || row.image_url,
      talles: row.talles,
      estado: (row.estado as ProductoEstado) || 'disponible',
      reservaInfo: parseJson(row.reserva_info),
      ventaInfo: parseJson(row.venta_info),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }
  
  static create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'estado' | 'reservaInfo' | 'ventaInfo'>): Product {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const stmt = db.prepare(
      'INSERT INTO Product (id, name, description, price, stock, categoryId, imageUrl, talles, estado, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    stmt.run(id, data.name, data.description, data.price, data.stock, data.categoryId, data.imageUrl, data.talles || null, 'disponible', now, now);
    return { ...data, id, estado: 'disponible' as ProductoEstado, reservaInfo: null, ventaInfo: null, createdAt: new Date(now), updatedAt: new Date(now) };
  }
  
  static update(id: string, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): void {
    const now = new Date().toISOString();
    const current = this.findById(id);
    if (!current) return;

    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) { updates.push('name = ?'); values.push(data.name); }
    if (data.description !== undefined) { updates.push('description = ?'); values.push(data.description); }
    if (data.price !== undefined) { updates.push('price = ?'); values.push(data.price); }
    if (data.stock !== undefined) { updates.push('stock = ?'); values.push(data.stock); }
    if (data.categoryId !== undefined) { updates.push('categoryId = ?'); values.push(data.categoryId); }
    if (data.imageUrl !== undefined) { updates.push('imageUrl = ?'); values.push(data.imageUrl); }
    if (data.talles !== undefined) { updates.push('talles = ?'); values.push(data.talles); }
    if (data.estado !== undefined) { updates.push('estado = ?'); values.push(data.estado); }
    if (data.reservaInfo !== undefined) { updates.push('reserva_info = ?'); values.push(data.reservaInfo ? JSON.stringify(data.reservaInfo) : null); }
    if (data.ventaInfo !== undefined) { updates.push('venta_info = ?'); values.push(data.ventaInfo ? JSON.stringify(data.ventaInfo) : null); }

    updates.push('updatedAt = ?');
    values.push(now);
    values.push(id);

    const stmt = db.prepare(`UPDATE Product SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
  }

  static cambiarEstado(id: string, estado: ProductoEstado, info?: ReservaInfo | VentaInfo | null): void {
    const now = new Date().toISOString();
    let reservaInfo: string | null = null;
    let ventaInfo: string | null = null;

    if (estado === 'reservado' && info) {
      reservaInfo = JSON.stringify(info);
    } else if (estado === 'vendido' && info) {
      ventaInfo = JSON.stringify(info);
    }

    const stmt = db.prepare(
      `UPDATE Product SET estado = ?, reserva_info = ?, venta_info = ?, updatedAt = ? WHERE id = ?`
    );
    stmt.run(estado, reservaInfo, ventaInfo, now, id);
  }

  static delete(id: string): void {
    ReservaModel.deleteByProductoId(id);
    VentaModel.deleteByProductId(id);
    const stmt = db.prepare('DELETE FROM Product WHERE id = ?');
    stmt.run(id);
  }

  static countByEstado(): { disponible: number; reservado: number; vendido: number; total: number } {
    const stmt = db.prepare(`
      SELECT 
        estado,
        COUNT(*) as count 
      FROM Product 
      GROUP BY estado
    `);
    const rows = stmt.all() as any[];
    
    const result = { disponible: 0, reservado: 0, vendido: 0, total: 0 };
    for (const row of rows) {
      if (row.estado === 'disponible') result.disponible = row.count;
      else if (row.estado === 'reservado') result.reservado = row.count;
      else if (row.estado === 'vendido') result.vendido = row.count;
      result.total += row.count;
    }
    return result;
  }

  static countByCategory(): { categoryId: string; categoryName: string; count: number }[] {
    const stmt = db.prepare(`
      SELECT 
        p.categoryId,
        c.name as categoryName,
        COUNT(*) as count 
      FROM Product p
      LEFT JOIN Category c ON p.categoryId = c.id
      GROUP BY p.categoryId
    `);
    const rows = stmt.all() as any[];
    return rows.map(row => ({
      categoryId: row.categoryId,
      categoryName: row.categoryName || 'Sin categoría',
      count: row.count
    }));
  }
}

export class VentaModel {
  static findAll(): Venta[] {
    const stmt = db.prepare('SELECT * FROM Venta ORDER BY fecha_venta DESC');
    const rows = stmt.all() as any[];
    return rows.map(row => ({
      id: row.id,
      productoId: row.producto_id,
      nombreCliente: row.nombre_cliente,
      telefonoCliente: row.telefono_cliente,
      metodoPago: row.metodo_pago,
      precioVenta: row.precio_venta,
      nota: row.nota,
      fechaVenta: new Date(row.fecha_venta),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      producto: ProductModel.findById(row.producto_id)
    }));
  }

  static findById(id: number): Venta | null {
    const stmt = db.prepare('SELECT * FROM Venta WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      productoId: row.producto_id,
      nombreCliente: row.nombre_cliente,
      telefonoCliente: row.telefono_cliente,
      metodoPago: row.metodo_pago,
      precioVenta: row.precio_venta,
      nota: row.nota,
      fechaVenta: new Date(row.fecha_venta),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      producto: ProductModel.findById(row.producto_id)
    };
  }

  static findByDateRange(inicio: Date, fin: Date): Venta[] {
    const stmt = db.prepare('SELECT * FROM Venta WHERE fecha_venta BETWEEN ? AND ? ORDER BY fecha_venta DESC');
    const rows = stmt.all(inicio.toISOString(), fin.toISOString()) as any[];
    return rows.map(row => ({
      id: row.id,
      productoId: row.producto_id,
      nombreCliente: row.nombre_cliente,
      telefonoCliente: row.telefono_cliente,
      metodoPago: row.metodo_pago,
      precioVenta: row.precio_venta,
      nota: row.nota,
      fechaVenta: new Date(row.fecha_venta),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      producto: ProductModel.findById(row.producto_id)
    }));
  }

  static create(data: Omit<Venta, 'id' | 'createdAt' | 'updatedAt' | 'fechaVenta' | 'producto'>): Venta {
    const now = new Date().toISOString();
    const stmt = db.prepare(
      `INSERT INTO Venta (producto_id, nombre_cliente, telefono_cliente, metodo_pago, precio_venta, nota, fecha_venta, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const info = stmt.run(
      data.productoId,
      data.nombreCliente ?? null,
      data.telefonoCliente ?? null,
      data.metodoPago ?? null,
      data.precioVenta ?? null,
      data.nota ?? null,
      now,
      now,
      now
    );
    return { ...data, id: Number(info.lastInsertRowid), fechaVenta: new Date(now), createdAt: new Date(now), updatedAt: new Date(now) };
  }

  static getEstadisticas(): {
    totalVentas: number;
    montoTotal: number;
    ventasHoy: number;
    montoHoy: number;
    ventasSemana: number;
    montoSemana: number;
    ventasMes: number;
    montoMes: number;
  } {
    const hoy = new Date();
    const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const inicioSemana = new Date(inicioDia);
    inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    const allVentas = this.findAll();
    
    const ventasHoy = allVentas.filter(v => v.fechaVenta >= inicioDia);
    const ventasSemana = allVentas.filter(v => v.fechaVenta >= inicioSemana);
    const ventasMes = allVentas.filter(v => v.fechaVenta >= inicioMes);

    return {
      totalVentas: allVentas.length,
      montoTotal: allVentas.reduce((sum, v) => sum + (v.precioVenta || 0), 0),
      ventasHoy: ventasHoy.length,
      montoHoy: ventasHoy.reduce((sum, v) => sum + (v.precioVenta || 0), 0),
      ventasSemana: ventasSemana.length,
      montoSemana: ventasSemana.reduce((sum, v) => sum + (v.precioVenta || 0), 0),
      ventasMes: ventasMes.length,
      montoMes: ventasMes.reduce((sum, v) => sum + (v.precioVenta || 0), 0),
    };
  }

  static delete(id: number): void {
    const stmt = db.prepare('DELETE FROM Venta WHERE id = ?');
    stmt.run(id);
  }

  static deleteByProductId(productoId: string): void {
    const stmt = db.prepare('DELETE FROM Venta WHERE producto_id = ?');
    stmt.run(productoId);
  }
}

export class ReservaModel {
  static findAll(): Reserva[] {
    const stmt = db.prepare('SELECT * FROM Reserva ORDER BY fecha_reserva DESC');
    const rows = stmt.all() as any[];
    return rows.map(this.mapRow);
  }

  static findActivas(): Reserva[] {
    const stmt = db.prepare("SELECT * FROM Reserva WHERE estado = 'activa' ORDER BY fecha_reserva DESC");
    const rows = stmt.all() as any[];
    return rows.map(this.mapRow);
  }

  static findById(id: number): Reserva | null {
    const stmt = db.prepare('SELECT * FROM Reserva WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return this.mapRow(row);
  }

  static findVencidas(): Reserva[] {
    const now = new Date().toISOString();
    const stmt = db.prepare("SELECT * FROM Reserva WHERE estado = 'activa' AND fecha_vencimiento < ?");
    const rows = stmt.all(now) as any[];
    return rows.map(this.mapRow);
  }

  private static mapRow(row: any): Reserva {
    return {
      id: row.id,
      productoId: row.producto_id,
      nombreCliente: row.nombre_cliente,
      telefonoCliente: row.telefono_cliente,
      fechaReserva: new Date(row.fecha_reserva),
      fechaVencimiento: row.fecha_vencimiento ? new Date(row.fecha_vencimiento) : undefined,
      nota: row.nota,
      estado: row.estado as Reserva['estado'],
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      producto: ProductModel.findById(row.producto_id) ?? undefined
    };
  }

  static create(data: Omit<Reserva, 'id' | 'createdAt' | 'updatedAt' | 'estado' | 'producto'>): Reserva {
    const now = new Date().toISOString();
    const stmt = db.prepare(
      `INSERT INTO Reserva (producto_id, nombre_cliente, telefono_cliente, fecha_reserva, fecha_vencimiento, nota, estado, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const info = stmt.run(
      data.productoId,
      data.nombreCliente,
      data.telefonoCliente ?? null,
      now,
      data.fechaVencimiento?.toISOString() ?? null,
      data.nota ?? null,
      'activa',
      now,
      now
    );
    return { ...data, id: Number(info.lastInsertRowid), estado: 'activa' as const, createdAt: new Date(now), updatedAt: new Date(now) };
  }

  static updateEstado(id: number, estado: Reserva['estado']): void {
    const now = new Date().toISOString();
    const stmt = db.prepare('UPDATE Reserva SET estado = ?, updatedAt = ? WHERE id = ?');
    stmt.run(estado, now, id);
  }

  static delete(id: number): void {
    const stmt = db.prepare('DELETE FROM Reserva WHERE id = ?');
    stmt.run(id);
  }

  static cancelByProductoId(productoId: string): void {
    const now = new Date().toISOString();
    const stmt = db.prepare("UPDATE Reserva SET estado = 'cancelada', updatedAt = ? WHERE producto_id = ? AND estado = 'activa'");
    stmt.run(now, productoId);
  }

  static deleteByProductoId(productoId: string): void {
    const stmt = db.prepare('DELETE FROM Reserva WHERE producto_id = ?');
    stmt.run(productoId);
  }

  static markExpiredAsVencida(): number {
    const now = new Date().toISOString();
    const stmt = db.prepare("UPDATE Reserva SET estado = 'vencida', updatedAt = ? WHERE estado = 'activa' AND fecha_vencimiento < ?");
    const result = stmt.run(now, now);
    return result.changes;
  }
}

export class ConfigModel {
  static findFirst(): Config | null {
    const stmt = db.prepare('SELECT * FROM Config ORDER BY id DESC LIMIT 1');
    const row = stmt.get() as any;
    if (!row) return null;
    return {
      ...row,
      storeInfo: parseJson(row.storeInfo),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }

  static upsert(storeInfo: any): void {
    const now = new Date().toISOString();
    const existing = this.findFirst();
    if (existing) {
      const stmt = db.prepare('UPDATE Config SET storeInfo = ?, updatedAt = ? WHERE id = ?');
      stmt.run(JSON.stringify(storeInfo), now, existing.id);
    } else {
      const stmt = db.prepare('INSERT INTO Config (storeInfo, createdAt, updatedAt) VALUES (?, ?, ?)');
      stmt.run(JSON.stringify(storeInfo), now, now);
    }
  }
}

export class ConversationModel {
  static findById(id: number): Conversation | null {
    const stmt = db.prepare('SELECT * FROM Conversation WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      nombreCliente: row.nombre_cliente,
      telefonoCliente: row.telefono_cliente,
      fechaInicio: new Date(row.fecha_inicio),
      totalMensajes: row.total_mensajes,
      necesitaAtencion: Boolean(row.necesita_atencion),
      resumen: row.resumen,
      mensajes: parseJson(row.mensajes),
      userInfo: parseJson(row.user_info),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  static findAll(): Conversation[] {
    const stmt = db.prepare('SELECT * FROM Conversation ORDER BY created_at DESC');
    const rows = stmt.all() as any[];
    return rows.map(row => ({
      id: row.id,
      nombreCliente: row.nombre_cliente,
      telefonoCliente: row.telefono_cliente,
      fechaInicio: new Date(row.fecha_inicio),
      totalMensajes: row.total_mensajes,
      necesitaAtencion: Boolean(row.necesita_atencion),
      resumen: row.resumen,
      mensajes: parseJson(row.mensajes),
      userInfo: parseJson(row.user_info),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));
  }

  static count(where?: { necesitaAtencion?: boolean }): number {
    let query = 'SELECT COUNT(*) as count FROM Conversation';
    const params: any[] = [];
    
    if (where?.necesitaAtencion !== undefined) {
      query += ' WHERE necesita_atencion = ?';
      params.push(where.necesitaAtencion ? 1 : 0);
    }
    
    const result = db.prepare(query).get(...params) as any;
    return result.count;
  }

  static create(data: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt' | 'fechaInicio'>): Conversation {
    const now = new Date().toISOString();
    const stmt = db.prepare(
      `INSERT INTO Conversation (nombre_cliente, telefono_cliente, fecha_inicio, total_mensajes, necesita_atencion, resumen, mensajes, userInfo, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const info = stmt.run(
      data.nombreCliente ?? null, 
      data.telefonoCliente ?? null, 
      now, 
      data.totalMensajes ?? 0, 
      data.necesitaAtencion ? 1 : 0, 
      data.resumen ?? null, 
      JSON.stringify(data.mensajes), 
      JSON.stringify(data.userInfo), 
      now, 
      now
    );
    return { ...data, id: Number(info.lastInsertRowid), createdAt: new Date(now), updatedAt: new Date(now), fechaInicio: new Date(now) };
  }
  
  static update(id: number, data: Partial<Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>>): void {
    const now = new Date().toISOString();
    const stmt = db.prepare(
      `UPDATE Conversation SET 
       nombre_cliente = COALESCE(?, nombre_cliente), 
       telefono_cliente = COALESCE(?, telefono_cliente), 
       total_mensajes = COALESCE(?, total_mensajes),
       necesita_atencion = COALESCE(?, necesita_atencion),
       resumen = COALESCE(?, resumen),
       mensajes = COALESCE(?, mensajes),
       userInfo = COALESCE(?, userInfo),
       updatedAt = ?
       WHERE id = ?`
    );
    stmt.run(
      data.nombreCliente ?? null, 
      data.telefonoCliente ?? null, 
      data.totalMensajes ? Number(data.totalMensajes) : null, 
      data.necesitaAtencion ? 1 : 0, 
      data.resumen ?? null, 
      JSON.stringify(data.mensajes), 
      JSON.stringify(data.userInfo), 
      now, 
       id
    );
  }

  static delete(id: number): void {
    const stmt = db.prepare('DELETE FROM Conversation WHERE id = ?');
    stmt.run(id);
  }
}
