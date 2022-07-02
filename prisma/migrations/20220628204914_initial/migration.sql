-- CreateEnum
CREATE TYPE "ValveStatus" AS ENUM ('open', 'closed');

-- CreateTable
CREATE TABLE "Cistern" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "maxWaterHeight" INTEGER NOT NULL,
    "minWaterHeight" INTEGER NOT NULL,
    "waterLevelThreshold" INTEGER NOT NULL,

    CONSTRAINT "Cistern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterLevel" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "level" INTEGER NOT NULL,
    "cisternId" INTEGER NOT NULL,

    CONSTRAINT "WaterLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Distance" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "distance" INTEGER NOT NULL,
    "sensorIp" TEXT NOT NULL,

    CONSTRAINT "Distance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "ip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "height" INTEGER NOT NULL,
    "offset" INTEGER NOT NULL,
    "cisternId" INTEGER NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("ip")
);

-- CreateTable
CREATE TABLE "Valve" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "status" "ValveStatus" NOT NULL,

    CONSTRAINT "Valve_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cistern_name_key" ON "Cistern"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_cisternId_key" ON "Sensor"("cisternId");

-- CreateIndex
CREATE UNIQUE INDEX "Valve_name_key" ON "Valve"("name");

-- AddForeignKey
ALTER TABLE "WaterLevel" ADD CONSTRAINT "WaterLevel_cisternId_fkey" FOREIGN KEY ("cisternId") REFERENCES "Cistern"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distance" ADD CONSTRAINT "Distance_sensorIp_fkey" FOREIGN KEY ("sensorIp") REFERENCES "Sensor"("ip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_cisternId_fkey" FOREIGN KEY ("cisternId") REFERENCES "Cistern"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
