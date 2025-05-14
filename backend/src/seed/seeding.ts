import { Role, Status } from "@prisma/client";
import { faker } from "@faker-js/faker";

import prisma from "../prisma/prisma_config";

async function main() {
  console.log("Clearing database...");

  // Clear existing data
  await prisma.postLike.deleteMany();
  await prisma.postComment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database cleared.");

  console.log("Seeding database...");

  // Create Users
  const users = await Promise.all(
    Array.from({ length: 10 }).map(async (_, i) => {
      return prisma.user.create({
        data: {
          email: faker.internet.email(),
          username: faker.internet.username(),
          password: faker.internet.password(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          bio: faker.lorem.sentence(),
          avatar: faker.image.avatar(),
          type:
            i === 0
              ? Role.ADMIN
              : faker.helpers.arrayElement([Role.READER, Role.WRITER]),
          registrationDate: faker.date.past(),
          lastLoginDate: faker.date.recent(),
          userStatus: faker.helpers.arrayElement([
            Status.ACTIVE,
            Status.SUSPENDED,
            Status.BLOCKED,
          ]),
          phoneNumber: faker.phone.number(),
          walletAddress: faker.finance.ethereumAddress(),
        },
      });
    })
  );

  console.log(`Created ${users.length} users.`);

  // Create Posts
  const posts = await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      const randomUser = faker.helpers.arrayElement(users);

      return prisma.post.create({
        data: {
          title: faker.lorem.words(5),
          subtitle: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(3),
          titleImage: faker.image.url(),
          category: faker.helpers.arrayElement([
            "Technology",
            "Health",
            "Lifestyle",
            "Education",
          ]),
          commentsEnabled: faker.datatype.boolean(),
          approved: faker.datatype.boolean(),
          date: faker.date.past(),
          updatedDate: faker.date.recent(),
          authorId: randomUser.id,
        },
      });
    })
  );

  console.log(`Created ${posts.length} posts.`);

  // Create Comments
  const comments = await Promise.all(
    Array.from({ length: 50 }).map(async () => {
      const randomUser = faker.helpers.arrayElement(users);
      const randomPost = faker.helpers.arrayElement(posts);
      return prisma.postComment.create({
        data: {
          postId: randomPost.id,
          userId: randomUser.id,
          comment: faker.lorem.sentence(),
          date: faker.date.past(),
          updatedDate: faker.date.recent(),
        },
      });
    })
  );

  console.log(`Created ${comments.length} comments.`);

  // Create Likes
  const likes = await Promise.all(
    Array.from({ length: 100 }).map(async () => {
      const randomUser = faker.helpers.arrayElement(users);
      const randomPost = faker.helpers.arrayElement(posts);
      return prisma.postLike.create({
        data: {
          postId: randomPost.id,
          userId: randomUser.id,
          likedDate: faker.date.recent(),
        },
      });
    })
  );

  console.log(`Created ${likes.length} likes.`);
}

main()
  .then(() => {
    console.log("Seeding completed.");
    prisma.$disconnect();
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    prisma.$disconnect();
    process.exit(1);
  });
