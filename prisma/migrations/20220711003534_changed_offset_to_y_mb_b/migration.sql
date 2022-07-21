/*
  Warnings:

  - You are about to drop the column `offset` on the `Sensor` table. All the data in the column will be lost.
  - Added the required column `coefficient` to the `Sensor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `intercept` to the `Sensor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sensor" DROP COLUMN "offset",
ADD COLUMN     "coefficient" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "intercept" DOUBLE PRECISION NOT NULL;
