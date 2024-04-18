/*
  Warnings:

  - A unique constraint covering the columns `[subscriptionEmail]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Subscription_subscriptionEmail_key` ON `Subscription`(`subscriptionEmail`);
