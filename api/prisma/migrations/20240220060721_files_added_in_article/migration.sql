/*
  Warnings:

  - Added the required column `filesURL` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manuscriptFile` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Article` ADD COLUMN `filesURL` JSON NOT NULL,
    ADD COLUMN `manuscriptFile` VARCHAR(191) NOT NULL;
