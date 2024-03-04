/*
  Warnings:

  - Added the required column `publicPdfName` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Article` ADD COLUMN `publicPdfName` VARCHAR(191) NOT NULL;
