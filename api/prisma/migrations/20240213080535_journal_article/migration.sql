-- CreateTable
CREATE TABLE `Jounral` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `journalTitle` VARCHAR(191) NOT NULL,
    `journalImageURL` VARCHAR(191) NOT NULL,
    `journalAbbreviation` VARCHAR(191) NOT NULL,
    `journalLanguage` VARCHAR(191) NOT NULL,
    `journalISSN` VARCHAR(191) NOT NULL,
    `journalDOI` VARCHAR(191) NOT NULL,
    `journalStartYear` INTEGER NOT NULL,
    `journalPublishedArticles` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Jounral_journalTitle_key`(`journalTitle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Article` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `articleTitle` VARCHAR(191) NOT NULL,
    `journalId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Article_articleTitle_key`(`articleTitle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_journalId_fkey` FOREIGN KEY (`journalId`) REFERENCES `Jounral`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
