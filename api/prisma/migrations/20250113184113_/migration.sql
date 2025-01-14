/*
  Warnings:

  - A unique constraint covering the columns `[payment_intent]` on the table `UserFullIssue` will be added. If there are existing duplicate values, this will fail.
  - Made the column `payment_intent` on table `UserFullIssue` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `UserFullIssue` MODIFY `payment_intent` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `UserFullIssue_payment_intent_key` ON `UserFullIssue`(`payment_intent`);
