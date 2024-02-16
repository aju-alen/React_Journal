/*
  Warnings:

  - You are about to drop the `Author` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `articleAuthors` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Author` DROP FOREIGN KEY `Author_articleId_fkey`;

-- AlterTable
ALTER TABLE `Article` ADD COLUMN `articleAuthors` JSON NOT NULL;

-- DropTable
DROP TABLE `Author`;
