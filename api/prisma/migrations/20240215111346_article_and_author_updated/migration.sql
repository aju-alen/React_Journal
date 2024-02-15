/*
  Warnings:

  - You are about to drop the column `authorSurname` on the `Author` table. All the data in the column will be lost.
  - Added the required column `authorAffiliation` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorEmail` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorGivenName` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorLastName` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorTitle` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Author` DROP COLUMN `authorSurname`,
    ADD COLUMN `authorAffiliation` VARCHAR(191) NOT NULL,
    ADD COLUMN `authorEmail` VARCHAR(191) NOT NULL,
    ADD COLUMN `authorGivenName` VARCHAR(191) NOT NULL,
    ADD COLUMN `authorLastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `authorTitle` VARCHAR(191) NOT NULL;
