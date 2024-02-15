/*
  Warnings:

  - You are about to alter the column `specialReview` on the `Article` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `Article` MODIFY `articleAcceptedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `articlePublishedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `specialReview` BOOLEAN NOT NULL;
