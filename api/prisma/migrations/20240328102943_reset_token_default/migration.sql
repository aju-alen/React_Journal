-- DropIndex
DROP INDEX `User_resetToken_key` ON `User`;

-- AlterTable
ALTER TABLE `User` MODIFY `resetToken` VARCHAR(255) NOT NULL DEFAULT '';
