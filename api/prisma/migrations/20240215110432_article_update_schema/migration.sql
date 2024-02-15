/*
  Warnings:

  - Added the required column `articleAbstract` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `articleKeywords` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialReview` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Article` ADD COLUMN `articleAbstract` VARCHAR(191) NOT NULL,
    ADD COLUMN `articleKeywords` VARCHAR(191) NOT NULL,
    ADD COLUMN `specialReview` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `articleReceivedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
