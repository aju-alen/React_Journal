-- AlterTable
ALTER TABLE `Article` ADD COLUMN `reviewerAcceptedById` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_reviewerAcceptedById_fkey` FOREIGN KEY (`reviewerAcceptedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
