/*
  Warnings:

  - You are about to drop the column `issueJournalId` on the `FullIssue` table. All the data in the column will be lost.
  - Added the required column `journalId` to the `FullIssue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `FullIssue` DROP FOREIGN KEY `FullIssue_issueJournalId_fkey`;

-- AlterTable
ALTER TABLE `FullIssue` DROP COLUMN `issueJournalId`,
    ADD COLUMN `journalId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `FullIssue` ADD CONSTRAINT `FullIssue_journalId_fkey` FOREIGN KEY (`journalId`) REFERENCES `Journal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
