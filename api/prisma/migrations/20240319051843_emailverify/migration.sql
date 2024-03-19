/*
  Warnings:

  - Added the required column `emailVerificationToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `emailVerificationToken` VARCHAR(191) NOT NULL,
    ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false;
