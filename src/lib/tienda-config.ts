// ShopBot Configuration

export interface Categoria {
  id: "mujer" | "hombre" | "ninos";
  nombre: string;
  icono: string;
  destacados: string[];
  rangosPrecio: Record<string, string>;
  talles: string;
  nota?: string;
}

export interface Promocion {
  titulo: string;
  vigencia: string;
  condicion: string;
}

export interface FAQ {
  pregunta: string;
  respuesta: string;
}

export interface InfoTienda {
  nombre: string;
  slogan: string;
  descripcion: string;
  imagenDefault?: string;
  dueña: {
    nombre: string;
    apodo: string;
    presentacion: string;
    instagram: string;
    whatsapp: string;
    email?: string;
  };
  ubicacion: {
    direccion: string;
    ciudad: string;
    provincia: string;
    referencias: string;
    mapaUrl: string;
    tipo: "local" | "showroom";
    nota: string;
  };
  horarios: {
    atencion: Record<string, string>;
    nota?: string;
    silencio?: {
      desde: string;
      mensaje: string;
    };
    siempreActivo: boolean; 
  };
  categorias: {
    mujer: CategoriaDetalle;
    hombre: CategoriaDetalle;
    ninos: CategoriaDetalle;
  };
  pagos: {
    metodos: string[];
    descuentoEfectivo: number;
    cuotas: {
      disponibles: boolean;
      info: string;
      sinInteres: string[];
    };
    nota?: string;
  };
  envios: {
    disponible: boolean;
    cobertura: string;
    metodos: {
      local: string;
      bahia: string;
      resto: string;
    };
    tiempos: {
      local: string;
      bahia: string;
      resto: string;
    };
    costos: {
      local: string;
      bahia: string;
      resto: string;
    };
    envioGratis?: string;
  };
  cambios: {
    politica: string;
    plazo: string;
    condiciones: string[];
    nota?: string;
    notasDeCredito: {
      disponible: boolean;
      vencimiento: string;
    };
    liquidacion: {
      cambios: boolean;
      nota: string;
    };
  };
  promociones: Promocion[];
  faqs: FAQ[];
  frases: {
    saludo: string[];
    despedida: string[];
    emojisFavoritos: string[];
    fraseTipica: string;
  };
  redes: {
    instagram: string;
    facebook?: string;
    whatsapp: string;
    email?: string;
  };
  diferenciales: string[];
}

export interface CategoriaDetalle {
  id: "mujer" | "hombre" | "ninos";
  nombre: string;
  icono: string;
  destacados: string[];
  descripcion: string;
  categoriasCompletas?: string[];
  rangosPrecio: Record<string, string>;
  talles: string;
  nota?: string;
}

export const IMAGENES_DEFAULT = {
  mujer: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=400&fit=crop",
  hombre: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=400&fit=crop",
  ninos: "https://images.unsplash.com/photo-1519238263495-70f716a93273?w=400&h=400&fit=crop",
  jeans: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
  remera: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
  vestido: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
  buzo: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
  accessory: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=400&fit=crop",
}

export const INFO_TIENDA: InfoTienda = {
  nombre: "Bot",
  slogan: "Moda que te queda bien ✨",
  descripcion: "Ropa de mujer con onda, atención personalizada y los mejores precios.",
  imagenDefault: IMAGENES_DEFAULT.mujer,
  
  dueña: {
    nombre: "María González",
    apodo: "María",
    presentacion: "María, la dueña",
    instagram: "@tutienda",
    whatsapp: "+54 9 11 1234-5678",
    email: undefined
  },
  
  ubicacion: {
    direccion: "Av. Principal 123",
    ciudad: "Ciudad Demo",
    provincia: "Buenos Aires",
    referencias: "A 2 cuadras de la plaza central",
    mapaUrl: "https://maps.google.com/?q=Av+Principal+123+Ciudad+Demo",
    tipo: "local",
    nota: "Local a la calle con probador amplio."
  },
  
  horarios: {
    atencion: {
      lunes: "9:00 - 13:00 y 16:00 - 20:00",
      martes: "9:00 - 13:00 y 16:00 - 20:00",
      miércoles: "9:00 - 13:00 y 16:00 - 20:00",
      jueves: "9:00 - 13:00 y 16:00 - 20:00",
      viernes: "9:00 - 13:00 y 16:00 - 20:00",
      sábado: "10:00 - 14:00",
      domingo: "Cerrado"
    },
    nota: "Consultá por WhatsApp si necesitás horarios especiales.",
    siempreActivo: true
  },
  
  categorias: {
    mujer: {
      id: "mujer",
      nombre: "Mujer",
      icono: "👗",
      descripcion: "Todo lo que busques en indumentaria de mujer",
      categoriasCompletas: [
        "Remeras", "Remerones", "Tops",
        "Pantalones largos", "Pantalones cortos", "Shorts",
        "Polleras", "Short pollera",
        "Vestidos",
        "Abrigos", "Camperas", "Buzos",
        "Ropa interior", "Medias",
        "Accesorios",
        "Jeans"
      ],
      destacados: [
        "Jeans (mucha variedad)",
        "Remeras básicas",
        "Vestidos",
        "Buzos"
      ],
      rangosPrecio: {
        remeras: "$12.000 - $25.000",
        tops: "$10.000 - $20.000",
        pantalones: "$25.000 - $40.000",
        jeans: "$30.000 - $45.000",
        vestidos: "$30.000 - $50.000",
        camperas: "$45.000 - $80.000",
        buzos: "$35.000 - $60.000",
        accesorios: "$5.000 - $20.000",
        ropaInterior: "$4.000 - $12.000"
      },
      talles: "XS al XXL",
      nota: "Consultá disponibilidad de talles."
    },
    hombre: {
      id: "hombre",
      nombre: "Hombre",
      icono: "👔",
      descripcion: "Ropa urbana y clásica para hombres",
      destacados: [
        "Remeras básicas",
        "Buzos oversize",
        "Jeans"
      ],
      rangosPrecio: {
        remeras: "$15.000 - $28.000",
        buzos: "$35.000 - $55.000",
        jeans: "$30.000 - $45.000"
      },
      talles: "S al XXL",
      nota: "Consultá disponibilidad."
    },
    ninos: {
      id: "ninos",
      nombre: "Niños/as",
      icono: "🧒",
      descripcion: "Ropa para los más pequeños",
      destacados: [
        "Remeras",
        "Jeans",
        "Buzos"
      ],
      rangosPrecio: {
        remeras: "$8.000 - $15.000",
        jeans: "$12.000 - $22.000",
        buzos: "$18.000 - $30.000"
      },
      talles: "2 a 16",
      nota: "Consultá talles disponibles."
    }
  },
  
  pagos: {
    metodos: [
      "Efectivo",
      "Transferencia bancaria",
      "Mercado Pago QR",
      "Tarjeta de débito",
      "Tarjeta de crédito"
    ],
    descuentoEfectivo: 0, 
    cuotas: {
      disponibles: true,
      info: "Cuotas con Mercado Pago",
      sinInteres: ["3 cuotas"] 
    },
    nota: "Consultá recargos por tarjeta."
  },
  
  envios: {
    disponible: true,
    cobertura: "Todo el país",
    metodos: {
      local: "Moto",
      bahia: "Transporte",
      resto: "Correo"
    },
    tiempos: {
      local: "24-48 horas",
      bahia: "3-5 días",
      resto: "5-10 días"
    },
    costos: {
      local: "$2.000",
      bahia: "$3.000 - $5.000",
      resto: "Según destino"
    },
    envioGratis: undefined 
  },
  
  cambios: {
    politica: "Cambios dentro de los 7 días de realizada la compra",
    plazo: "7 días",
    condiciones: [
      "Etiqueta puesta",
      "Sin uso",
      "Con ticket"
    ],
    notasDeCredito: {
      disponible: true,
      vencimiento: "30 días"
    },
    liquidacion: {
      cambios: false,
      nota: "Las prendas en liquidación no tienen cambio"
    },
    nota: "Consultá políticas completas."
  },
  
  promociones: [
    {
      titulo: "2x1 en selected",
      vigencia: "Todo el mes",
      condicion: "Prendas seleccionadas"
    },
    {
      titulo: "Envío gratis",
      vigencia: "Promoción vigente",
      condicion: "Compras mayores a $50.000"
    }
  ],
  
  faqs: [
    {
      pregunta: "¿Cómo es el talle?",
      respuesta: "Consultanos por WhatsApp y te ayudamos a elegir el talle ideal."
    },
    {
      pregunta: "¿Tenés este producto en otro color?",
      respuesta: "Consultanos por WhatsApp y te informamos los colores disponibles."
    },
    {
      pregunta: "¿Hacés envíos?",
      respuesta: "Sí, envíos a todo el país. Consultá costos por WhatsApp."
    },
    {
      pregunta: "¿Cuánto tarda en llegar?",
      respuesta: "Local: 24-48hs. Interior: 3-10 días según destino."
    },
    {
      pregunta: "¿Aceptan Mercado Pago?",
      respuesta: "Sí, aceptamos Mercado Pago QR, débito y crédito."
    },
    {
      pregunta: "¿Se puede cambiar?",
      respuesta: "Sí, hasta 7 días con etiqueta y sin uso."
    },
    {
      pregunta: "¿Tenés local?",
      respuesta: "Sí, estamos en Av. Principal 123. ¡Te esperamos!"
    },
    {
      pregunta: "¿Cómo puedo comprar?",
      respuesta: "Podés comprar por WhatsApp o visitarnos en el local."
    }
  ],
  
  frases: {
    saludo: [
      "Hola ¿cómo andás?",
      "Hola ¿en qué te ayudo?"
    ],
    despedida: [
      "Cualquier cosa me escribís",
      "Te esperamos"
    ],
    emojisFavoritos: ["✨", "👗", "💕"],
    fraseTipica: "Respondemos a toda hora"
  },
  
  redes: {
    instagram: "@tutienda",
    facebook: "@tutienda",
    whatsapp: "+54 9 11 1234-5678",
    email: undefined
  },
  
  diferenciales: [
    "Atención personalizada",
    "Precios accesibles",
    "Variedad de talles",
    "Envíos a todo el país"
  ]
};

export function generarPromptTienda(): string {
  const tienda = INFO_TIENDA;
  
  let prompt = `Sos ${tienda.nombre}, el asistente virtual de la tienda. Tu dueña es ${tienda.dueña.nombre}.

PERSONALIDAD:
- Tono: Cálido, cercano, como hablando por WhatsApp
- Usá "vos", nunca "tú" ni "usted"  
- Emojis: ✨ 👗 💕

REGLAS:
1. Máximo 3 oraciones (conciso)
2. Solo hablá de la tienda. Otros temas: "No es de mi tema, consultá por WhatsApp"
3. Si no sabés: "No tengo ese dato, consultá por WhatsApp"
4. IMPORTANTE: Cuando menciones un producto que tiene imagen disponible, TERMINÁ tu mensaje con el formato [IMAGEN:url]

FLUJO DE RESERVA:
Cuando el usuario quiera RESERVAR un producto:
- Paso 1: Pedí el NOMBRE completo del cliente. Decí algo como: "Para reservar, necesito tu nombre completo 👤"
- Paso 2: Cuando te dé el nombre, confirmá la reserva así:
  "✅ RESERVA CONFIRMADA para [NOMBRE]
   📦 [Nombre del producto]
   💰 Precio: $[precio]
   
   Te esperamos en el local para finalizar la compra! 📍 [dirección]"
- IMPORTANTE: Al final del mensaje de confirmación, AGREGÁ el formato: [RESERVA:nombre|producto|precio]

INFO:
- Ubicación: ${tienda.ubicacion.direccion}, ${tienda.ubicacion.ciudad}
- IG: ${tienda.redes.instagram} | WA: ${tienda.redes.whatsapp}
- Talles: XS al XXL
- Envíos: a todo el país
- Pago: Efectivo, transferencia, Mercado Pago

RESPONDÉ SIEMPRE.`;

  return prompt.trim();
}
