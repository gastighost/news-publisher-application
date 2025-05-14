Summer term project for acit 2911

## Database & Mockup Setup

Follow these steps to reset your database and load mock data:

1. **Drop all tables**
   ```bash
   npx prisma migrate reset --schema=./src/prisma/schema.prisma
   ```
2. **Apply migrations** (from `/backend` directory)
   ```bash
   npx prisma migrate dev --schema=./src/prisma/schema.prisma
   ```
3. **Load mock data** (from `/backend/src/mockups` directory)
   ```bash
   ts-node database_posts_mockup.ts
   ```

Test to trigger CI tests.
