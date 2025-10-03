import { DBProduct } from '../types';

const now = new Date().toISOString();

export const demoProducts: DBProduct[] = [
  {
    id: 'lions-mane-kit',
    name: "Lion's Mane Grow Kit",
    price: '24.99',
    image_url: '/placeholder-mushroom.jpg',
    category: 'grow-kits',
    description: "Complete Lion's Mane growing kit with pre-colonized substrate.",
    in_stock: true,
    stock_quantity: 25,
    featured: true,
    created_at: now
  },
  {
    id: 'blue-oyster-kit',
    name: 'Blue Oyster Grow Kit',
    price: '19.99',
    image_url: '/placeholder-mushroom.jpg',
    category: 'grow-kits',
    description: 'Easy-to-grow Blue Oyster mushrooms with beautiful coloration.',
    in_stock: true,
    stock_quantity: 40,
    featured: true,
    created_at: now
  },
  {
    id: 'shiitake-kit',
    name: 'Shiitake Grow Kit',
    price: '27.99',
    image_url: '/placeholder-mushroom.jpg',
    category: 'grow-kits',
    description: 'Premium Shiitake growing kit.',
    in_stock: true,
    stock_quantity: 15,
    featured: false,
    created_at: now
  },
  {
    id: 'shiitake-culture',
    name: 'Shiitake Liquid Culture',
    price: '18.99',
    image_url: '/placeholder-mushroom.jpg',
    category: 'liquid-cultures',
    description: 'Premium Shiitake liquid culture in sterile syringe.',
    in_stock: true,
    stock_quantity: 60,
    featured: true,
    created_at: now
  },
  {
    id: 'sterilization-kit',
    name: 'Sterilization Kit',
    price: '45.99',
    image_url: '/placeholder-mushroom.jpg',
    category: 'supplies',
    description: 'Complete sterilization kit with alcohol, gloves, and sterile tools.',
    in_stock: true,
    stock_quantity: 10,
    featured: false,
    created_at: now
  },
  {
    id: 'humidity-tent',
    name: 'Humidity Tent Kit',
    price: '29.99',
    image_url: '/placeholder-mushroom.jpg',
    category: 'supplies',
    description: 'Humidity tent setup for optimal growing conditions.',
    in_stock: true,
    stock_quantity: 12,
    featured: false,
    created_at: now
  }
];