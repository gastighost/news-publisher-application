import prisma from "../prisma/prisma_config";
import fs from "fs/promises"
import { Role } from "@prisma/client";
import dotenv from "dotenv"

const fakeDbPath : string = __dirname + "/fake_db.json"
dotenv.config({ path: require('path').resolve(__dirname, '../../.env') }); 



async function createPost(
    title_: string,
    authorId_: number,
    content_: string,
    subtitle_?: string | null, 
    titleImage_?: string | null,
    date_?: Date,
    updatedDate_?: Date | null,
    commentsEnabled_?: boolean,
    lastUpdate_?: Date | null,
    approved_?: boolean,
    category_?: string | null 
) {
    const post = await prisma.post.create({
        data: {
            title: title_,
            authorId: authorId_,
            content: content_,
            subtitle: subtitle_ || null,
            titleImage: titleImage_ || null,
            commentsEnabled: commentsEnabled_ ?? true,
            approved: approved_ ?? false,
            category: category_ || null, 
            ...(date_ && { date: date_ }),
            ...(updatedDate_ && { updatedDate: updatedDate_ }),
            ...(lastUpdate_ && { lastUpdate: lastUpdate_ })
        }
    });

    return post
}

async function createMockUsers() {
  console.log("Creating mock users...");
  
  const mockUsers = [
    { id: 1, email: "user1@example.com", firstName: "John", lastName: "Doe", password: "password123", type: "ADMIN" as Role },
    { id: 2, email: "user2@example.com", firstName: "Jane", lastName: "Smith", password: "password123", type: "WRITER" as Role },
    { id: 3, email: "user3@example.com", firstName: "Sam", lastName: "Wilson", password: "password123", type: "WRITER" as Role },
    { id: 4, email: "user4@example.com", firstName: "Alex", lastName: "Johnson", password: "password123", type: "WRITER" as Role },
    { id: 5, email: "user5@example.com", firstName: "Taylor", lastName: "Brown", password: "password123", type: "WRITER" as Role },
  ];
  
  for (const user of mockUsers) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id: user.id }
      });
      
      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            password: user.password,
            type: user.type,
            username: `user${user.id}`
          }
        });
      }
    } catch (error) {
      console.error(`Failed to create user ${user.id}:`, error);
    }
  }
  
  console.log("Mock users created successfully");
}

async function createMockUpPosts() {
  await createMockUsers();
 
  const postsString = await fs.readFile(fakeDbPath, "utf-8")
  const posts = JSON.parse(postsString)
  
  try {
    console.log(`Creating ${posts.length} mock posts...`);
    
    for (const post of posts) {
      await createPost(
        post.title,
        post.authorId,
        post.content,
        post.subtitle || null,
        post.titleImage || null,
        post.date ? new Date(post.date) : undefined,
        post.updatedDate ? new Date(post.updatedDate) : null,
        post.commentsEnabled,
        post.lastUpdate ? new Date(post.lastUpdate) : null,
        post.approved,
        post.category || null 
      );
    }
    
    console.log("Mock posts created successfully");
  } catch (error) {
    console.error("Failed to create mock posts:", error);
  }
}

createMockUpPosts()
