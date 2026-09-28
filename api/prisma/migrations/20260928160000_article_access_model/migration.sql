-- AlterTable
ALTER TABLE `Article` ADD COLUMN `accessModel` VARCHAR(191) NOT NULL DEFAULT 'subscription';

-- Backfill: already-paid articles become open access
UPDATE `Article` SET `accessModel` = 'open_access' WHERE `paymentStatus` = true;
