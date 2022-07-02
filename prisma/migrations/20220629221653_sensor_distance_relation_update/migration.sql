/*
  Warnings:

  - The primary key for the `Sensor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `sensorCisternId` to the `Distance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Distance" DROP CONSTRAINT "Distance_sensorIp_fkey";

-- AlterTable
ALTER TABLE "Distance" ADD COLUMN     "sensorCisternId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Sensor" DROP CONSTRAINT "Sensor_pkey",
ADD CONSTRAINT "Sensor_pkey" PRIMARY KEY ("ip", "cisternId");

-- AddForeignKey
ALTER TABLE "Distance" ADD CONSTRAINT "Distance_sensorIp_sensorCisternId_fkey" FOREIGN KEY ("sensorIp", "sensorCisternId") REFERENCES "Sensor"("ip", "cisternId") ON DELETE RESTRICT ON UPDATE CASCADE;
