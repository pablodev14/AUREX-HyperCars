export const brand = {
  name: "AUREX",
  legalName: "AUREX Hypercars S.A.S.",
  tagline: "Ingenieria colombiana para la elite del alto rendimiento.",
  founded: 2026,
  headquarters: "Bogota, Colombia",
  mission:
    "Crear deportivos de produccion limitada con aerodinamica activa, trenes motrices hibridos y una experiencia de compra boutique para clientes que exigen precision, lujo y pista.",
  warranty: "5 anos o 80.000 km, mantenimiento incluido durante 36 meses.",
  concierge:
    "Cada comprador recibe configurador privado, telemetria de pista, entrega ceremonial y acompanamiento tecnico en Colombia."
};

export const models = [
  {
    id: "noctis-v12",
    name: "Noctis V12",
    label: "Gran turismo radical",
    priceCop: 1950000000,
    reservationCop: 120000000,
    powerHp: 820,
    acceleration: "2.7 s",
    topSpeed: "342 km/h",
    range: "620 km",
    image: "/assets/car-noctis.svg",
    colors: ["Cobre Aurora", "Negro Volcan", "Plata Titanio"],
    description:
      "Motor V12 biturbo con asistencia electrica, cabina de cuero nappa y chasis monocasco en fibra de carbono.",
    features: ["Aerodinamica activa", "Escape Inconel", "Suspension magnetoreologica", "Modo pista homologado"]
  },
  {
    id: "tempest-e",
    name: "Tempest E-Hybrid",
    label: "Hypercar electrificado",
    priceCop: 2350000000,
    reservationCop: 150000000,
    powerHp: 1040,
    acceleration: "2.3 s",
    topSpeed: "356 km/h",
    range: "740 km",
    image: "/assets/car-tempest.svg",
    colors: ["Rojo Cinetico", "Azul Ion", "Blanco Ceramico"],
    description:
      "Sistema hibrido enchufable con vectorizacion de torque y paquete aero para maximo agarre en curvas rapidas.",
    features: ["Torque vectorial", "Bateria 24 kWh", "Frenos carbono-ceramicos", "Launch control predictivo"]
  },
  {
    id: "rayo-gt4",
    name: "Rayo GT4",
    label: "Pista legal para calle",
    priceCop: 1620000000,
    reservationCop: 90000000,
    powerHp: 710,
    acceleration: "3.0 s",
    topSpeed: "318 km/h",
    range: "580 km",
    image: "/assets/car-rayo.svg",
    colors: ["Amarillo Solar", "Grafito Mate", "Verde Esmeralda"],
    description:
      "La opcion mas pura de AUREX: ligera, directa y creada para conductores que quieren sentir cada apice.",
    features: ["Jaula semiintegrada", "Aleron ajustable", "Diferencial mecanico", "Bucket seats Alcantara"]
  }
];

export const financingPlans = [
  {
    id: "elite-36",
    name: "Credito Elite 36",
    downPayment: "30%",
    termMonths: 36,
    rate: "1.05% M.V.",
    detail: "Cuota premium con opcion de recompra garantizada al finalizar el periodo."
  },
  {
    id: "signature-60",
    name: "Credito Signature 60",
    downPayment: "20%",
    termMonths: 60,
    rate: "1.18% M.V.",
    detail: "Financiacion flexible para empresarios, independientes y clientes corporativos."
  },
  {
    id: "track-lease",
    name: "Leasing Track",
    downPayment: "15%",
    termMonths: 48,
    rate: "Desde DTF + 9.5%",
    detail: "Leasing operativo con seguro todo riesgo, telemetria y mantenimiento incluido."
  }
];

export const accreditations = [
  {
    title: "Homologacion vial colombiana",
    detail: "Vehiculos configurados para registro, SOAT, RTM y entrega legal en territorio nacional."
  },
  {
    title: "Estandar AUREX CarbonCell",
    detail: "Monocasco certificado por pruebas internas de torsion, fatiga y absorcion de impacto."
  },
  {
    title: "Garantia de procedencia",
    detail: "Trazabilidad de componentes, bitacora digital y auditoria de ensamblaje por unidad."
  },
  {
    title: "Programa Track Safe",
    detail: "Curso de conduccion deportiva y revision tecnica previa a cada evento de pista oficial."
  }
];

export const dealers = [
  {
    id: "bogota",
    city: "Bogota",
    name: "AUREX House Bogota",
    address: "Cra. 7 # 84-72, Zona T",
    phone: "+57 601 555 0188",
    lat: 4.6667,
    lng: -74.0534,
    services: ["Showroom", "Configuracion", "Entrega", "Servicio tecnico"]
  },
  {
    id: "medellin",
    city: "Medellin",
    name: "AUREX Performance Medellin",
    address: "Av. El Poblado # 10-90",
    phone: "+57 604 555 0221",
    lat: 6.2088,
    lng: -75.5679,
    services: ["Showroom", "Credito", "Test drive privado"]
  },
  {
    id: "cali",
    city: "Cali",
    name: "AUREX Valley Cali",
    address: "Av. 6N # 35N-100",
    phone: "+57 602 555 0412",
    lat: 3.4516,
    lng: -76.532,
    services: ["Showroom", "Servicio tecnico", "Repuestos"]
  },
  {
    id: "barranquilla",
    city: "Barranquilla",
    name: "AUREX Caribe",
    address: "Cra. 53 # 82-86",
    phone: "+57 605 555 0308",
    lat: 10.9878,
    lng: -74.7889,
    services: ["Showroom", "Entrega", "Credito"]
  },
  {
    id: "cartagena",
    city: "Cartagena",
    name: "AUREX Marina Club",
    address: "Bocagrande, Av. San Martin # 8-20",
    phone: "+57 605 555 0877",
    lat: 10.391,
    lng: -75.4794,
    services: ["Showroom boutique", "Eventos", "Entrega"]
  },
  {
    id: "bucaramanga",
    city: "Bucaramanga",
    name: "AUREX Santander",
    address: "C.C. Cacique, Anillo Vial",
    phone: "+57 607 555 0744",
    lat: 7.1193,
    lng: -73.1227,
    services: ["Servicio tecnico", "Credito", "Configuracion"]
  }
];
