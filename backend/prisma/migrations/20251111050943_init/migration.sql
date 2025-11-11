/*
  Warnings:

  - A unique constraint covering the columns `[document]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `document` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "document" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "UserOtp" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserOtp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserOtp_userId_idx" ON "UserOtp"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_document_key" ON "User"("document");

-- AddForeignKey
ALTER TABLE "UserOtp" ADD CONSTRAINT "UserOtp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
