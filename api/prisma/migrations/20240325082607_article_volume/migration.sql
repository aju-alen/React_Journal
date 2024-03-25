/*
  Warnings:

  - Added the required column `articleVolume` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Article` ADD COLUMN `articleVolume` INTEGER NOT NULL;
