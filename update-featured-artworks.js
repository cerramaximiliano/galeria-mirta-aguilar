// Script para actualizar obras destacadas en MongoDB
// Ejecutar con: mongo < update-featured-artworks.js
// O en MongoDB Compass ejecutar cada comando por separado

// Conectar a la base de datos (ajustar el nombre si es necesario)
// use tuBaseDeDatos;

// Marcar las primeras 10 obras como destacadas
db.artworks.updateMany(
  { 
    title: { 
      $in: [
        "Composición Abstracta I",
        "Paisaje Onírico", 
        "Atardecer Dorado",
        "Jardín Secreto",
        "Movimiento en Rojo",
        "Energía Vital",
        "Primavera Eterna",
        "Textura del Tiempo",
        "Bosque Encantado",
        "Aurora",
        "Cosmos Interior"
      ]
    }
  },
  { $set: { featured: true } }
);

// Verificar cuántas obras fueron actualizadas
print("Obras marcadas como destacadas:");
db.artworks.find({ featured: true }).count();

// Mostrar las obras destacadas
print("\nLista de obras destacadas:");
db.artworks.find({ featured: true }, { title: 1, featured: 1 }).forEach(printjson);