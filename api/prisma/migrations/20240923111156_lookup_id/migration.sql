/*
  Warnings:

  - Added the required column `stripe_lookupId` to the `FullIssue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FullIssue` ADD COLUMN `stripe_lookupId` VARCHAR(191) NOT NULL;
