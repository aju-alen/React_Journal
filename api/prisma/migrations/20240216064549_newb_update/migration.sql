/*
  Warnings:

  - You are about to drop the `Jounral` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Article` DROP FOREIGN KEY `Article_journalId_fkey`;

-- DropTable
DROP TABLE `Jounral`;

-- CreateTable
CREATE TABLE `Journal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `journalTitle` VARCHAR(191) NOT NULL,
    `journalImageURL` VARCHAR(191) NOT NULL,
    `journalAbbreviation` VARCHAR(191) NOT NULL,
    `journalLanguage` VARCHAR(191) NOT NULL,
    `journalISSN` VARCHAR(191) NOT NULL,
    `journalDOI` VARCHAR(191) NOT NULL,
    `journalStartYear` INTEGER NOT NULL,
    `journalPublishedArticles` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Journal_journalTitle_key`(`journalTitle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_journalId_fkey` FOREIGN KEY (`journalId`) REFERENCES `Journal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
