/*
  Warnings:

  - A unique constraint covering the columns `[journalAbbreviation]` on the table `Journal` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Journal_journalAbbreviation_key` ON `Journal`(`journalAbbreviation`);
