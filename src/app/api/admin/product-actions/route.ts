import { NextResponse } from 'next/server';
import { ProductModel, ReservaModel, VentaModel } from '@/lib/models';

export async function POST(req: Request) {
  try {
    const { action, productId, formData } = await req.json();

    switch (action) {
      case 'reservar': {
        const { nombreCliente, telefonoCliente, diasValidez, nota } = formData || {};
        
        if (!nombreCliente || nombreCliente.length < 2) {
          return NextResponse.json({ success: false, message: 'Nombre requerido' }, { status: 400 });
        }

        const producto = ProductModel.findById(productId);
        if (!producto) {
          return NextResponse.json({ success: false, message: 'Producto no encontrado' }, { status: 404 });
        }

        if (producto.estado !== 'disponible') {
          return NextResponse.json({ success: false, message: `Producto ya está ${producto.estado}` }, { status: 400 });
        }

        const fechaVencimiento = new Date();
        fechaVencimiento.setDate(fechaVencimiento.getDate() + (parseInt(diasValidez) || 3));

        const reserva = ReservaModel.create({
          productoId: productId,
          nombreCliente,
          telefonoCliente: telefonoCliente || undefined,
          fechaReserva: new Date(),
          fechaVencimiento,
          nota: nota || undefined
        });

        ProductModel.cambiarEstado(productId, 'reservado', {
          nombreCliente,
          telefonoCliente: telefonoCliente || undefined,
          fechaReserva: new Date().toISOString(),
          fechaVencimiento: fechaVencimiento.toISOString(),
          reservaId: reserva.id
        });

        return NextResponse.json({ 
          success: true, 
          message: `Reservado para ${nombreCliente} hasta ${fechaVencimiento.toLocaleDateString()}` 
        });
      }

      case 'vender': {
        const { nombreCliente, telefonoCliente, metodoPago, precioVenta, nota } = formData || {};

        if (!nombreCliente || nombreCliente.length < 2) {
          return NextResponse.json({ success: false, message: 'Nombre requerido' }, { status: 400 });
        }

        if (!metodoPago) {
          return NextResponse.json({ success: false, message: 'Método de pago requerido' }, { status: 400 });
        }

        const producto = ProductModel.findById(productId);
        if (!producto) {
          return NextResponse.json({ success: false, message: 'Producto no encontrado' }, { status: 404 });
        }

        if (producto.estado === 'vendido') {
          return NextResponse.json({ success: false, message: 'Producto ya fue vendido' }, { status: 400 });
        }

        const venta = VentaModel.create({
          productoId: productId,
          nombreCliente,
          telefonoCliente: telefonoCliente || undefined,
          metodoPago,
          precioVenta: parseFloat(precioVenta) || producto.price,
          nota: nota || undefined
        });

        if (producto.estado === 'reservado') {
          const reserva = ReservaModel.findActivas().find(r => r.productoId === productId);
          if (reserva) {
            ReservaModel.updateEstado(reserva.id, 'completada');
          }
        }

        ProductModel.cambiarEstado(productId, 'vendido', {
          nombreCliente,
          telefonoCliente: telefonoCliente || undefined,
          fechaVenta: new Date().toISOString(),
          metodoPago,
          precioVenta: parseFloat(precioVenta) || producto.price,
          ventaId: venta.id
        });

        return NextResponse.json({ 
          success: true, 
          message: `Vendido a ${nombreCliente} por $${parseFloat(precioVenta || producto.price).toLocaleString()}` 
        });
      }

      case 'liberar': {
        const producto = ProductModel.findById(productId);
        if (!producto) {
          return NextResponse.json({ success: false, message: 'Producto no encontrado' }, { status: 404 });
        }

        if (producto.estado === 'reservado') {
          const reserva = ReservaModel.findActivas().find(r => r.productoId === productId);
          if (reserva) {
            ReservaModel.updateEstado(reserva.id, 'cancelada');
          }
        }

        ProductModel.cambiarEstado(productId, 'disponible', null);

        return NextResponse.json({ success: true, message: 'Producto liberado' });
      }

      default:
        return NextResponse.json({ success: false, message: 'Acción no válida' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error en product-actions:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}
