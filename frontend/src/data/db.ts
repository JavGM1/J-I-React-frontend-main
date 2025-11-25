export type Specs = {
  materials: string[];
  dimensions: string; // Como por ejemplo: "120 x 60 x 75 cm"
  color: string; // Como por ejemplo: "amaderado"
  weight: string; // Como por ejemplo: "1.2 kg" o "350 g"
  warranty: string; // Como por ejemplo: "1 año"
};

export type Product = {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  category: string;
  specs: Specs;
};

export const db: Product[] = [
  {
    id: 1,
    name: "Escritorio de madera",
    image: "escritorio",
    description: "Escritorio de madera",
    price: 129990,
    category: "oficina",
    specs: {
      materials: ["Madera", "Acero inoxidable"],
      dimensions: "120x60x75cm",
      color: "Amaderado",
      weight: "50kg",
      warranty: "1 año",
    },
  },
  {
    id: 2,
    name: "Ropero madera",
    image: "ropero",
    description: "Ropero de madera",
    price: 249990,
    category: "oficina",
    specs: {
      materials: ["Madera"],
      dimensions: "138x174x40cm",
      color: "Amaderado",
      weight: "45kg",
      warranty: "1 año",
    },
  },
  {
    id: 3,
    name: "Combo botiquín + Mueble",
    image: "combobotiquin",
    description: "Combo botiquín + mueble",
    price: 299990,
    category: "baño",
    specs: {
      materials: ["Madera"],
      dimensions: "120x60x75cm",
      color: "Nogal, Blanco",
      weight: "50kg",
      warranty: "1 año",
    },
  },
  {
    id: 4,
    name: "Silla Gamer",
    image: "sillagamer",
    description: "Silla gamer",
    price: 89990,
    category: "oficina", 
    specs: {
      materials: ["Cuero sintético"],
      dimensions: "70x70x130cm",
      color: "Negro",
      weight: "20kg",
      warranty: "1 año",
    },
  },
  {
    id: 5,
    name: "Mueble baño dark grey",
    image: "mueblebano",
    description: "Mueble de baño dark grey",
    price: 140990,
    category: "baño",
    specs: {
      materials: ["Metal"],
      dimensions: "50x71x46.5cm",
      color: "Gris Oscuro",
      weight: "45kg",
      warranty: "1 año",
    },
  },
  {
    id: 6,
    name: "Sofá cama",
    image: "sofacama",
    description: "Sofá cama",
    price: 199990,
    category: "living",
    specs: {
      materials: ["Terciopelo"],
      dimensions: "227x146x92",
      color: "Gris",
      weight: "Hasta 250kg",
      warranty: "1 año",
    },
  },
  {
    id: 7,
    name: "Estantería",
    image: "estanteria",
    description: "Estantería",
    price: 119990,
    category: "living",
    specs: {
      materials: ["Madera", "Acero inoxidable"],
      dimensions: "166x75x30cm",
      color: "Amaderado",
      weight: "50kg",
      warranty: "1 año",
    },
  },
  {
    id: 8,
    name: "Rack TV",
    image: "racktv",
    description: "Rack para TV",
    price: 69990,
    category: "living",
    specs: {
      materials: ["Madera"],
      dimensions: "166x75x30cm",
      color: "Amaderado",
      weight: "50kg",
      warranty: "1 año",
    },
  },
];
