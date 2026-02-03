import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Prisma 7 requires an adapter for database connections
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.inventoryLog.deleteMany();
  await prisma.product.deleteMany();
  console.log('✅ Cleared existing data');

  // Seed products with images from /public folder
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Baby Blue Penguin Plushie',
        description: 'Adorable kawaii penguin in soft baby blue. Perfect for cuddling and display. Super soft and huggable!',
        price: 24.99,
        image_url: '/cute-baby-blue-penguin-plushie-kawaii.jpg',
        stock_quantity: 15,
        status: 'active',
      },
      {
        name: 'Cotton Candy Puppy Dog Plushie',
        description: 'Sweet pink and blue puppy plushie with cotton candy colors. Ultra soft and perfect for dog lovers!',
        price: 26.99,
        image_url: '/cute-cotton-candy-pink-blue-puppy-dog-plushie-kawa.jpg',
        stock_quantity: 12,
        status: 'active',
      },
      {
        name: 'Pink Teddy Bear with Bow',
        description: 'Classic kawaii pink teddy bear with an adorable bow. A timeless gift for all ages!',
        price: 29.99,
        image_url: '/cute-kawaii-pink-teddy-bear-plushie-with-bow.jpg',
        stock_quantity: 20,
        status: 'active',
      },
      {
        name: 'Lavender Purple Bunny Rabbit',
        description: 'Soft lavender bunny with floppy ears. Perfect Easter gift or bedroom decoration!',
        price: 25.99,
        image_url: '/cute-lavender-purple-bunny-rabbit-plushie-kawaii.jpg',
        stock_quantity: 18,
        status: 'active',
      },
      {
        name: 'Mint Green Cat Kitten Plushie',
        description: 'Pastel mint green kitty with the sweetest face. Cat lovers will adore this kawaii plushie!',
        price: 24.99,
        image_url: '/cute-mint-green-cat-kitten-plushie-kawaii.jpg',
        stock_quantity: 14,
        status: 'active',
      },
      {
        name: 'Pastel Blue Sleeping Bunny',
        description: 'Peaceful sleeping bunny in soft pastel blue. Perfect for bedtime cuddles and sweet dreams!',
        price: 27.99,
        image_url: '/cute-pastel-blue-bunny-plushie-kawaii-sleeping.jpg',
        stock_quantity: 10,
        status: 'active',
      },
      {
        name: 'Pastel Pink Fluffy Cat',
        description: 'Ultra fluffy pink cat plushie that\'s irresistibly soft. The fluffiest friend you\'ll ever have!',
        price: 28.99,
        image_url: '/cute-pastel-pink-fluffy-cat-plushie-kawaii.jpg',
        stock_quantity: 8,
        status: 'active',
      },
      {
        name: 'Pastel Purple Owl Plushie',
        description: 'Wise and adorable purple owl with big kawaii eyes. Perfect for owl enthusiasts!',
        price: 26.99,
        image_url: '/cute-pastel-purple-owl-plushie-kawaii.jpg',
        stock_quantity: 16,
        status: 'active',
      },
      {
        name: 'Pastel Rainbow Unicorn',
        description: 'Magical rainbow unicorn with pastel colors and sparkly horn. Make wishes come true!',
        price: 32.99,
        image_url: '/cute-pastel-rainbow-unicorn-plushie-kawaii.jpg',
        stock_quantity: 22,
        status: 'active',
      },
      {
        name: 'Pastel Yellow Duck Plushie',
        description: 'Cheerful yellow duckling that\'s ready for bath time cuddles. Quack-tastic cuteness!',
        price: 23.99,
        image_url: '/cute-pastel-yellow-duck-plushie-kawaii.jpg',
        stock_quantity: 19,
        status: 'active',
      },
      {
        name: 'Peach Pink Bear Plushie',
        description: 'Soft peach-pink bear with the gentlest smile. Perfect for comfort and cuddles!',
        price: 25.99,
        image_url: '/cute-peach-pink-bear-plushie-kawaii.jpg',
        stock_quantity: 13,
        status: 'active',
      },
      {
        name: 'Strawberry Pink Cow Plushie',
        description: 'Sweet strawberry-themed cow plushie. Moo-velous and delightfully kawaii!',
        price: 27.99,
        image_url: '/cute-strawberry-pink-cow-plushie-kawaii.jpg',
        stock_quantity: 11,
        status: 'active',
      },
      {
        name: 'Yellow Honey Bear with Bee',
        description: 'Adorable honey bear with tiny bee friend. Sweet as honey and twice as cute!',
        price: 29.99,
        image_url: '/cute-yellow-honey-bear-plushie-kawaii-with-bee.jpg',
        stock_quantity: 17,
        status: 'active',
      },
      {
        name: 'Sleeping Pink Bunny Soft Toy',
        description: 'Precious pink bunny in peaceful slumber. The ultimate bedtime companion!',
        price: 26.99,
        image_url: '/sleeping-pink-bunny-plushie-kawaii-soft-toy-cute.jpg',
        stock_quantity: 21,
        status: 'active',
      },
    ],
  });

  console.log(`✅ Created ${products.count} products`);

  // Verify the data
  const productCount = await prisma.product.count();
  console.log(`📊 Total products in database: ${productCount}`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
