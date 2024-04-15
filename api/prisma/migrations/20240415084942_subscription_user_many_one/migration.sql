/*
  Warnings:

  - You are about to drop the column `expiry` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionType` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `hosted_invoice_url` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionAmmount` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionDescription` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionEmail` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionInterval` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionPeriodEnd` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionPeriodStart` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Subscription` DROP COLUMN `expiry`,
    DROP COLUMN `subscriptionType`,
    ADD COLUMN `hosted_invoice_url` VARCHAR(191) NOT NULL,
    ADD COLUMN `subscriptionAmmount` INTEGER NOT NULL,
    ADD COLUMN `subscriptionDescription` VARCHAR(191) NOT NULL,
    ADD COLUMN `subscriptionEmail` VARCHAR(191) NOT NULL,
    ADD COLUMN `subscriptionInterval` VARCHAR(191) NOT NULL,
    ADD COLUMN `subscriptionPeriodEnd` DATETIME(3) NOT NULL,
    ADD COLUMN `subscriptionPeriodStart` DATETIME(3) NOT NULL;
