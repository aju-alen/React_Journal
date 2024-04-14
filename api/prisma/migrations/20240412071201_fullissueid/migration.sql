/*
  Warnings:

  - Added the required column `issueImageURL` to the `FullIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issueNumber` to the `FullIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issuePriceID` to the `FullIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issueVolume` to the `FullIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FullIssueId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FullIssue` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `issueImageURL` VARCHAR(191) NOT NULL,
    ADD COLUMN `issueNumber` INTEGER NOT NULL,
    ADD COLUMN `issuePriceID` VARCHAR(191) NOT NULL,
    ADD COLUMN `issueVolume` INTEGER NOT NULL;

-- AlterTable

-- AddForeignKey
