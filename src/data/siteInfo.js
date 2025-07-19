export const siteInfoData = {
  biography: {
    title: "Mirta Susana Aguilar",
    subtitle: "Artista Plástica Argentina",
    content: `Mirta Susana Aguilar es una reconocida artista plástica argentina con más de 30 años de trayectoria en el mundo del arte. Su obra se caracteriza por la exploración constante de nuevas técnicas y la búsqueda de la expresión emocional a través del color y la forma.

Nacida en Buenos Aires, comenzó su formación artística desde temprana edad, estudiando con grandes maestros del arte argentino. Su trabajo ha sido expuesto en numerosas galerías y museos tanto nacionales como internacionales.

Su estilo único combina elementos del expresionismo abstracto con toques de realismo mágico, creando obras que invitan al espectador a sumergirse en un mundo de sensaciones y emociones.`,
    profileImage: {
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      alt: "Mirta Susana Aguilar - Artista"
    },
    highlights: [
      { year: 2023, achievement: "Exposición individual en Galería Nacional de Arte" },
      { year: 2022, achievement: "Premio a la Trayectoria Artística - Academia Nacional de Bellas Artes" },
      { year: 2021, achievement: "Participación en la Bienal Internacional de Arte Contemporáneo" },
      { year: 2020, achievement: "Obra seleccionada para la colección permanente del MALBA" }
    ],
    exhibitions: [
      {
        year: 2023,
        title: "Colores del Alma",
        location: "Museo de Arte Moderno, Buenos Aires",
        description: "Retrospectiva de 20 años de trabajo artístico"
      },
      {
        year: 2022,
        title: "Horizontes Infinitos",
        location: "Centro Cultural Recoleta",
        description: "Muestra de obras recientes explorando paisajes imaginarios"
      },
      {
        year: 2021,
        title: "Encuentros",
        location: "Galería Zurbarán, Madrid",
        description: "Primera exposición individual en España"
      }
    ],
    awards: [
      {
        year: 2022,
        title: "Premio Nacional de Pintura",
        organization: "Academia Nacional de Bellas Artes"
      },
      {
        year: 2020,
        title: "Mención de Honor",
        organization: "Salón Nacional de Artes Visuales"
      },
      {
        year: 2019,
        title: "Primer Premio",
        organization: "Concurso Internacional de Arte Contemporáneo"
      }
    ]
  },
  contact: {
    email: "contacto@mirtaaguilar.com",
    phone: "+54 11 4123-4567",
    whatsapp: "+54 9 11 6789-0123",
    address: {
      street: "Av. Alvear 1234",
      city: "Buenos Aires",
      province: "CABA",
      country: "Argentina",
      postalCode: "C1129"
    },
    socialMedia: {
      instagram: "https://instagram.com/mirtaaguilararte",
      facebook: "https://facebook.com/mirtaaguilararte",
      twitter: "",
      linkedin: "",
      youtube: ""
    },
    businessHours: {
      monday: { open: "10:00", close: "18:00", isClosed: false },
      tuesday: { open: "10:00", close: "18:00", isClosed: false },
      wednesday: { open: "10:00", close: "18:00", isClosed: false },
      thursday: { open: "10:00", close: "18:00", isClosed: false },
      friday: { open: "10:00", close: "18:00", isClosed: false },
      saturday: { open: "10:00", close: "14:00", isClosed: false },
      sunday: { open: "", close: "", isClosed: true }
    },
    mapLocation: {
      lat: -34.5895,
      lng: -58.3974
    }
  },
  metadata: {
    lastUpdated: new Date().toISOString(),
    updatedBy: "admin@mirtaaguilar.com"
  }
};