/*
  Warnings:

  - Added the required column `awsId` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Article` ADD COLUMN `awsId` VARCHAR(191) NOT NULL,
    ALTER COLUMN `articleAcceptedDate` DROP DEFAULT,
    ALTER COLUMN `articlePublishedDate` DROP DEFAULT;
