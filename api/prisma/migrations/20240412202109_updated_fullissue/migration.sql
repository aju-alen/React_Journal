/*
  Warnings:

  - You are about to drop the column `issuePriceID` on the `FullIssue` table. All the data in the column will be lost.
  - Added the required column `issuePrice` to the `FullIssue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FullIssue` DROP COLUMN `issuePriceID`,
    ADD COLUMN `issuePrice` VARCHAR(191) NOT NULL;
