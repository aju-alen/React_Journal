/*
  Warnings:

  - Added the required column `amountCurrency` to the `UserFullIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountTotal` to the `UserFullIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoice_url` to the `UserFullIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_intent` to the `UserFullIssue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserFullIssue` ADD COLUMN `amountCurrency` VARCHAR(191) NOT NULL,
    ADD COLUMN `amountTotal` VARCHAR(191) NOT NULL,
    ADD COLUMN `invoice_url` VARCHAR(191) NOT NULL,
    ADD COLUMN `payment_intent` VARCHAR(191) NOT NULL;
