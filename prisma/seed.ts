import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

async function main() {
  const peer1 = await prisma.peer.create({
    data: {
      id: nanoid(),
      name: 'bobby peer',
      ip: '100.32.384.23',
      port: '2232',
    },
  });
  const peer2 = await prisma.peer.create({
    data: {
      id: nanoid(),
      name: 'alice peer',
      ip: '172.83.99.32',
      port: '8873',
    },
  });
  console.log({ peer1, peer2 });
}

(async () => {
  try {
    await main();
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
