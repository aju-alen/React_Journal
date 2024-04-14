/*
  Warnings:

  - Added the required column `issueDoccumentURL` to the `FullIssue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FullIssue` ADD COLUMN `issueDoccumentURL` VARCHAR(191) NOT NULL;
