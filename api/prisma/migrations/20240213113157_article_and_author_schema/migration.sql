/*
  Warnings:

  - Added the required column `articleAcceptedDate` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `articlePublishedDate` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `articleReceivedDate` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Article_articleTitle_key` ON `Article`;

-- AlterTable
ALTER TABLE `Article` ADD COLUMN `articleAcceptedDate` DATETIME(3) NOT NULL,
    ADD COLUMN `articlePublishedDate` DATETIME(3) NOT NULL,
    ADD COLUMN `articleReceivedDate` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Author` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `authorSurname` VARCHAR(191) NOT NULL,
    `articleId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Author` ADD CONSTRAINT `Author_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
