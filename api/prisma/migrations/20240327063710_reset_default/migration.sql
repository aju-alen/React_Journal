/*
  Warnings:

  - Made the column `resetToken` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `resetToken` VARCHAR(191) NOT NULL DEFAULT '0';
