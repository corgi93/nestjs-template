import { PrismaClient } from '@prisma/client';

/**
 * 현재 DB가 비어있어 일부 더미 데이터로 DB채우는 seed script.
 * 시드하는 데 필요한 더미 데이터와 쿼리 포함
 */

// init prisma client
const prisma = new PrismaClient();

async function main() {
    // 유저 2명 더미 데이터 생성
    const user1 = await prisma.user.upsert({
        where: { email: 'sabin@adams.com' },
        update: {},
        create: {
            email: 'sabin@adams.com',
            name: 'Sabin Adams',
            password: 'password-sabin',
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'alex@ruheni.com' },
        update: {},
        create: {
            email: 'alex@ruheni.com',
            name: 'Alex Ruheni',
            password: 'password-alex',
        },
    });

    // 2개 더미 데이터 생성
    const post1 = await prisma.article.upsert({
        where: { title: 'Prisma Adds Support for MongoDB' },
        update: {
            authorId: user1.id,
        },
        create: {
            title: 'Prisma Adds Support for MongoDB',
            body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
            description:
                "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
            published: false,
            authorId: user1.id,
        },
    });

    const post2 = await prisma.article.upsert({
        where: { title: "What's new in Prisma? (Q1/22)" },
        update: {
            authorId: user2.id,
        },
        create: {
            title: "What's new in Prisma? (Q1/22)",
            body: 'Our engineers have been working hard, issuing new releases with many improvements...',
            description:
                'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
            published: true,
            authorId: user2.id,
        },
    });

    console.log({ post1, post2 });
}

// execute the main function
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // close Prisma Client at the end
        await prisma.$disconnect();
    });
