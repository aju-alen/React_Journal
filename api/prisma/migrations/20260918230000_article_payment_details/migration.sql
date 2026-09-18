-- AlterTable
ALTER TABLE `Article` ADD COLUMN `paymentIntent` VARCHAR(191) NULL,
    ADD COLUMN `paymentAmount` INTEGER NULL,
    ADD COLUMN `paymentCurrency` VARCHAR(191) NULL,
    ADD COLUMN `paymentDate` DATETIME(3) NULL,
    ADD COLUMN `invoiceUrl` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Article_paymentIntent_key` ON `Article`(`paymentIntent`);
