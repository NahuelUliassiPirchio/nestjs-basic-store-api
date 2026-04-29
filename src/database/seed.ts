import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { Brand } from '../products/entities/brand.entity';
import { Category } from '../products/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { UserRole } from '../common/roles.enum';
import { Bid } from '../users/entities/bid.entity';
import { BidItem } from '../users/entities/bidItem.entity';
import { Order } from '../users/entities/order.entity';
import { OrderItem } from '../users/entities/orderItem.entity';
import { User } from '../users/entities/user.entity';

type EnvMap = Record<string, string>;

const parseEnvFile = (): EnvMap => {
  const envPath = path.join(process.cwd(), '.env');

  if (!fs.existsSync(envPath)) {
    return {};
  }

  return fs
    .readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .reduce<EnvMap>((env, line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);

      if (!match || match[1].startsWith('#')) {
        return env;
      }

      env[match[1]] = (match[2] ?? '').replace(/^['"]|['"]$/g, '');
      return env;
    }, {});
};

const env = { ...parseEnvFile(), ...process.env };
const databaseUri = env.DATABASE_URI;

if (!databaseUri) {
  throw new Error('DATABASE_URI is required to seed the database.');
}

const dataSource = new DataSource({
  type: 'postgres',
  url: databaseUri,
  synchronize: false,
  logging: env.TYPEORM_LOGGING === 'true',
  entities: [User, Order, OrderItem, Bid, BidItem, Brand, Category, Product],
});

const now = new Date();
const addDays = (days: number): Date =>
  new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

const main = async (): Promise<void> => {
  await dataSource.initialize();

  await dataSource.transaction(async (manager) => {
    await manager.query(`
      TRUNCATE TABLE
        "products_categories",
        "order_item",
        "bid_item",
        "bid",
        "order",
        "product",
        "brand",
        "category",
        "user"
      RESTART IDENTITY CASCADE
    `);

    const brandRepository = manager.getRepository(Brand);
    const categoryRepository = manager.getRepository(Category);
    const productRepository = manager.getRepository(Product);
    const userRepository = manager.getRepository(User);
    const orderRepository = manager.getRepository(Order);
    const orderItemRepository = manager.getRepository(OrderItem);
    const bidRepository = manager.getRepository(Bid);
    const bidItemRepository = manager.getRepository(BidItem);

    const brands = await brandRepository.save(
      brandRepository.create([
        {
          name: 'NovaTech',
          logo: 'https://placehold.co/120x120/111827/ffffff?text=NT',
        },
        {
          name: 'UrbanPeak',
          logo: 'https://placehold.co/120x120/0f766e/ffffff?text=UP',
        },
        {
          name: 'HomeNest',
          logo: 'https://placehold.co/120x120/7c2d12/ffffff?text=HN',
        },
        {
          name: 'PixelForge',
          logo: 'https://placehold.co/120x120/4338ca/ffffff?text=PF',
        },
        {
          name: 'EcoWave',
          logo: 'https://placehold.co/120x120/166534/ffffff?text=EW',
        },
      ]),
    );

    const categories = await categoryRepository.save(
      categoryRepository.create([
        { name: 'Electronics' },
        { name: 'Audio' },
        { name: 'Home Office' },
        { name: 'Gaming' },
        { name: 'Lifestyle' },
        { name: 'Smart Home' },
        { name: 'Outdoor' },
      ]),
    );

    const categoryByName = new Map(
      categories.map((category) => [category.name, category]),
    );
    const brandByName = new Map(brands.map((brand) => [brand.name, brand]));

    const products = await productRepository.save(
      productRepository.create([
        {
          name: 'Aurora Mechanical Keyboard',
          description:
            'Compact RGB mechanical keyboard with hot-swappable switches and aluminum frame.',
          image: 'https://picsum.photos/seed/aurora-keyboard/900/700',
          stock: 24,
          price: 129,
          brand: brandByName.get('NovaTech'),
          categories: [
            categoryByName.get('Electronics'),
            categoryByName.get('Gaming'),
            categoryByName.get('Home Office'),
          ],
        },
        {
          name: 'Pulse Wireless Headphones',
          description:
            'Noise-cancelling wireless headphones with 40-hour battery life and fast charging.',
          image: 'https://picsum.photos/seed/pulse-headphones/900/700',
          stock: 38,
          price: 179,
          brand: brandByName.get('PixelForge'),
          categories: [
            categoryByName.get('Audio'),
            categoryByName.get('Electronics'),
            categoryByName.get('Lifestyle'),
          ],
        },
        {
          name: 'Terra Standing Desk',
          description:
            'Electric standing desk with programmable height presets and cable management tray.',
          image: 'https://picsum.photos/seed/terra-desk/900/700',
          stock: 11,
          price: 449,
          brand: brandByName.get('HomeNest'),
          categories: [
            categoryByName.get('Home Office'),
            categoryByName.get('Lifestyle'),
          ],
        },
        {
          name: 'Orbit Desk Lamp',
          description:
            'Minimal LED desk lamp with wireless charging base and adjustable warm light.',
          image: 'https://picsum.photos/seed/orbit-lamp/900/700',
          stock: 52,
          price: 89,
          brand: brandByName.get('HomeNest'),
          categories: [
            categoryByName.get('Home Office'),
            categoryByName.get('Smart Home'),
          ],
        },
        {
          name: 'Summit Trail Backpack',
          description:
            'Weather-resistant everyday backpack with laptop compartment and modular pockets.',
          image: 'https://picsum.photos/seed/summit-backpack/900/700',
          stock: 31,
          price: 119,
          brand: brandByName.get('UrbanPeak'),
          categories: [
            categoryByName.get('Outdoor'),
            categoryByName.get('Lifestyle'),
          ],
        },
        {
          name: 'Vertex Gaming Mouse',
          description:
            'Ultra-light gaming mouse with precision sensor, low-latency wireless mode, and grip tape.',
          image: 'https://picsum.photos/seed/vertex-mouse/900/700',
          stock: 44,
          price: 99,
          brand: brandByName.get('PixelForge'),
          categories: [
            categoryByName.get('Gaming'),
            categoryByName.get('Electronics'),
          ],
        },
        {
          name: 'Breeze Smart Fan',
          description:
            'Quiet smart fan with app controls, scheduling, and room temperature automation.',
          image: 'https://picsum.photos/seed/breeze-fan/900/700',
          stock: 18,
          price: 159,
          brand: brandByName.get('EcoWave'),
          categories: [
            categoryByName.get('Smart Home'),
            categoryByName.get('Lifestyle'),
          ],
        },
        {
          name: 'Canvas 4K Monitor',
          description:
            '27-inch 4K monitor with accurate colors, USB-C power delivery, and slim bezels.',
          image: 'https://picsum.photos/seed/canvas-monitor/900/700',
          stock: 15,
          price: 389,
          brand: brandByName.get('NovaTech'),
          categories: [
            categoryByName.get('Electronics'),
            categoryByName.get('Home Office'),
          ],
        },
        {
          name: 'Wave Portable Speaker',
          description:
            'Water-resistant Bluetooth speaker with deep bass and all-day battery life.',
          image: 'https://picsum.photos/seed/wave-speaker/900/700',
          stock: 63,
          price: 79,
          brand: brandByName.get('EcoWave'),
          categories: [
            categoryByName.get('Audio'),
            categoryByName.get('Outdoor'),
            categoryByName.get('Lifestyle'),
          ],
        },
        {
          name: 'Focus Webcam Pro',
          description:
            'Sharp 2K webcam with autofocus, privacy shutter, and dual microphones.',
          image: 'https://picsum.photos/seed/focus-webcam/900/700',
          stock: 27,
          price: 139,
          brand: brandByName.get('NovaTech'),
          categories: [
            categoryByName.get('Electronics'),
            categoryByName.get('Home Office'),
          ],
        },
        {
          name: 'Ember Smart Mug',
          description:
            'Temperature-controlled mug that keeps coffee or tea at the perfect heat.',
          image: 'https://picsum.photos/seed/ember-mug/900/700',
          stock: 35,
          price: 74,
          brand: brandByName.get('HomeNest'),
          categories: [
            categoryByName.get('Smart Home'),
            categoryByName.get('Lifestyle'),
          ],
        },
        {
          name: 'Ridge Travel Jacket',
          description:
            'Lightweight jacket with hidden pockets, water-repellent finish, and packable design.',
          image: 'https://picsum.photos/seed/ridge-jacket/900/700',
          stock: 21,
          price: 149,
          brand: brandByName.get('UrbanPeak'),
          categories: [
            categoryByName.get('Outdoor'),
            categoryByName.get('Lifestyle'),
          ],
        },
      ]),
    );

    const password = await bcrypt.hash('Portfolio123!', 10);
    const users = await userRepository.save(
      userRepository.create([
        {
          email: 'admin@basicstore.dev',
          password,
          name: 'Portfolio Admin',
          address: 'Demo HQ, Buenos Aires',
          role: UserRole.ADMIN,
          avatar: 'https://i.pravatar.cc/180?img=12',
          phoneNumber: '+54 11 5555-0100',
        },
        {
          email: 'sofia.rivera@example.com',
          password,
          name: 'Sofia Rivera',
          address: 'Palermo, Buenos Aires',
          role: UserRole.CUSTOMER,
          avatar: 'https://i.pravatar.cc/180?img=32',
          phoneNumber: '+54 11 5555-0101',
        },
        {
          email: 'mateo.garcia@example.com',
          password,
          name: 'Mateo Garcia',
          address: 'Cordoba Capital',
          role: UserRole.CUSTOMER,
          avatar: 'https://i.pravatar.cc/180?img=15',
          phoneNumber: '+54 351 555-0102',
        },
        {
          email: 'valentina.lopez@example.com',
          password,
          name: 'Valentina Lopez',
          address: 'Rosario, Santa Fe',
          role: UserRole.CUSTOMER,
          avatar: 'https://i.pravatar.cc/180?img=47',
          phoneNumber: '+54 341 555-0103',
        },
        {
          email: 'lucas.martin@example.com',
          password,
          name: 'Lucas Martin',
          address: 'Mendoza Capital',
          role: UserRole.CUSTOMER,
          avatar: 'https://i.pravatar.cc/180?img=52',
          phoneNumber: '+54 261 555-0104',
        },
        {
          email: 'camila.torres@example.com',
          password,
          name: 'Camila Torres',
          address: 'Mar del Plata',
          role: UserRole.CUSTOMER,
          avatar: 'https://i.pravatar.cc/180?img=29',
          phoneNumber: '+54 223 555-0105',
        },
      ]),
    );

    const productByName = new Map(
      products.map((product) => [product.name, product]),
    );

    const orders = await orderRepository.save(
      orderRepository.create([
        { user: users[1], isActive: true },
        { user: users[2], isActive: false },
        { user: users[3], isActive: true },
        { user: users[4], isActive: false },
        { user: users[5], isActive: true },
      ]),
    );

    await orderItemRepository.save(
      orderItemRepository.create([
        {
          order: orders[0],
          product: productByName.get('Pulse Wireless Headphones'),
          quantity: 1,
        },
        {
          order: orders[0],
          product: productByName.get('Orbit Desk Lamp'),
          quantity: 2,
        },
        {
          order: orders[1],
          product: productByName.get('Summit Trail Backpack'),
          quantity: 1,
        },
        {
          order: orders[1],
          product: productByName.get('Wave Portable Speaker'),
          quantity: 1,
        },
        {
          order: orders[2],
          product: productByName.get('Canvas 4K Monitor'),
          quantity: 1,
        },
        {
          order: orders[3],
          product: productByName.get('Ember Smart Mug'),
          quantity: 3,
        },
        {
          order: orders[4],
          product: productByName.get('Vertex Gaming Mouse'),
          quantity: 1,
        },
        {
          order: orders[4],
          product: productByName.get('Aurora Mechanical Keyboard'),
          quantity: 1,
        },
      ]),
    );

    const bids = await bidRepository.save(
      bidRepository.create([
        {
          product: productByName.get('Canvas 4K Monitor'),
          initialDate: addDays(-3),
          endDate: addDays(4),
        },
        {
          product: productByName.get('Ridge Travel Jacket'),
          initialDate: addDays(-5),
          endDate: addDays(2),
        },
        {
          product: productByName.get('Terra Standing Desk'),
          initialDate: addDays(-12),
          endDate: addDays(-1),
        },
      ]),
    );

    await bidItemRepository.save(
      bidItemRepository.create([
        {
          bid: bids[0],
          user: users[2],
          bidAmount: 410,
          isAnonymous: false,
        },
        {
          bid: bids[0],
          user: users[3],
          bidAmount: 435,
          isAnonymous: true,
        },
        {
          bid: bids[0],
          user: users[4],
          bidAmount: 460,
          isAnonymous: false,
        },
        {
          bid: bids[1],
          user: users[1],
          bidAmount: 155,
          isAnonymous: false,
        },
        {
          bid: bids[1],
          user: users[5],
          bidAmount: 172,
          isAnonymous: true,
        },
        {
          bid: bids[2],
          user: users[3],
          bidAmount: 470,
          isAnonymous: false,
        },
        {
          bid: bids[2],
          user: users[4],
          bidAmount: 515,
          isAnonymous: false,
        },
      ]),
    );
  });

  console.log('Mock portfolio data seeded successfully.');
  console.log('Admin login: admin@basicstore.dev / Portfolio123!');
  console.log('Customer login: sofia.rivera@example.com / Portfolio123!');
};

main()
  .catch((error) => {
    console.error('Failed to seed mock data.');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });
