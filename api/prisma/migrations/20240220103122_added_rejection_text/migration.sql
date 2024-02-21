/*
  Warnings:

  - Added the required column `rejectionText` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Article` ADD COLUMN `rejectionText` VARCHAR(191) NOT NULL;
