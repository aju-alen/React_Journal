-- AlterTable
ALTER TABLE `User` ADD COLUMN `agreeTerms` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `marketingCommunications` BOOLEAN NOT NULL DEFAULT false;
