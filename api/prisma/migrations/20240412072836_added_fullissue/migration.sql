-- CreateTable
CREATE TABLE `_FullIssueToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_FullIssueToUser_AB_unique`(`A`, `B`),
    INDEX `_FullIssueToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_FullIssueToUser` ADD CONSTRAINT `_FullIssueToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `FullIssue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FullIssueToUser` ADD CONSTRAINT `_FullIssueToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
