-- AlterTable
ALTER TABLE `UserFullIssue` MODIFY `amountCurrency` VARCHAR(191) NULL,
    MODIFY `amountTotal` VARCHAR(191) NULL,
    MODIFY `invoice_url` VARCHAR(191) NULL,
    MODIFY `payment_intent` VARCHAR(191) NULL;
