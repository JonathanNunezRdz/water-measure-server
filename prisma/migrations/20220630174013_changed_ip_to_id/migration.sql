/*
  Warnings:

  - You are about to drop the column `sensorIp` on the `Distance` table. All the data in the column will be lost.
  - The primary key for the `Sensor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ip` on the `Sensor` table. All the data in the column will be lost.
  - Added the required column `sensorId` to the `Distance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Distance" DROP CONSTRAINT "Distance_sensorIp_sensorCisternId_fkey";

-- AlterTable
ALTER TABLE "Distance" DROP COLUMN "sensorIp",
ADD COLUMN     "sensorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Sensor" DROP CONSTRAINT "Sensor_pkey",
DROP COLUMN "ip",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id", "cisternId");

-- AddForeignKey
ALTER TABLE "Distance" ADD CONSTRAINT "Distance_sensorId_sensorCisternId_fkey" FOREIGN KEY ("sensorId", "sensorCisternId") REFERENCES "Sensor"("id", "cisternId") ON DELETE RESTRICT ON UPDATE CASCADE;
