/*
  Warnings:

  - Added the required column `articleIssue` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Article` ADD COLUMN `articleIssue` INTEGER NOT NULL;
