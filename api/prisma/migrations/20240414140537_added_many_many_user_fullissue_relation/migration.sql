-- CreateTable
CREATE TABLE `UserFullIssue` (
    `userId` VARCHAR(191) NOT NULL,
    `fullIssueId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`userId`, `fullIssueId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserFullIssue` ADD CONSTRAINT `UserFullIssue_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserFullIssue` ADD CONSTRAINT `UserFullIssue_fullIssueId_fkey` FOREIGN KEY (`fullIssueId`) REFERENCES `FullIssue`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
