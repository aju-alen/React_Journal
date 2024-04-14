/*
  Warnings:

  - Added the required column `issueJournalId` to the `FullIssue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FullIssue` ADD COLUMN `issueJournalId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `FullIssue` ADD CONSTRAINT `FullIssue_issueJournalId_fkey` FOREIGN KEY (`issueJournalId`) REFERENCES `Journal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
