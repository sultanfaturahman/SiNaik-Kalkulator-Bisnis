-- First, add the userId column as nullable
ALTER TABLE "calculations" ADD COLUMN "userId" TEXT;

-- Update existing calculations to link to a user (replace 'default-user-id' with an actual user ID from your database)
UPDATE "calculations" 
SET "userId" = (SELECT id FROM "User" LIMIT 1);

-- Now make the column required
ALTER TABLE "calculations" ALTER COLUMN "userId" SET NOT NULL;

-- Add the foreign key constraint
ALTER TABLE "calculations" ADD CONSTRAINT "calculations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;