/*
  Warnings:

  - The primary key for the `UserFullIssue` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `UserFullIssue` DROP FOREIGN KEY `UserFullIssue_fullIssueId_fkey`;

-- DropForeignKey
ALTER TABLE `UserFullIssue` DROP FOREIGN KEY `UserFullIssue_userId_fkey`;

-- AlterTable
ALTER TABLE `UserFullIssue` DROP PRIMARY KEY,
    MODIFY `userId` VARCHAR(191) NULL,
    MODIFY `fullIssueId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`payment_intent`);

-- AddForeignKey
ALTER TABLE `UserFullIssue` ADD CONSTRAINT `UserFullIssue_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserFullIssue` ADD CONSTRAINT `UserFullIssue_fullIssueId_fkey` FOREIGN KEY (`fullIssueId`) REFERENCES `FullIssue`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
