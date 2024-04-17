/*
  Warnings:

  - A unique constraint covering the columns `[invoiceId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Subscription_invoiceId_key` ON `Subscription`(`invoiceId`);
