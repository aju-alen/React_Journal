-- AlterTable
ALTER TABLE `UserFullIssue` MODIFY `amountCurrency` VARCHAR(191) NOT NULL DEFAULT 'aed',
    MODIFY `amountTotal` VARCHAR(191) NOT NULL DEFAULT '0',
    MODIFY `invoice_url` VARCHAR(191) NOT NULL DEFAULT '';
