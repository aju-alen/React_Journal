/*
  Warnings:

  - Added the required column `customerId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hosted_invoice_pdf` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `subscriptionPeriodEnd` on the `Subscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subscriptionPeriodStart` on the `Subscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `Subscription` ADD COLUMN `customerId` VARCHAR(191) NOT NULL,
    ADD COLUMN `hosted_invoice_pdf` VARCHAR(191) NOT NULL,
    ADD COLUMN `invoiceId` VARCHAR(191) NOT NULL,
    DROP COLUMN `subscriptionPeriodEnd`,
    ADD COLUMN `subscriptionPeriodEnd` INTEGER NOT NULL,
    DROP COLUMN `subscriptionPeriodStart`,
    ADD COLUMN `subscriptionPeriodStart` INTEGER NOT NULL;
