/*
  Warnings:

  - You are about to drop the column `projectId` on the `Module` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Module" DROP CONSTRAINT "Module_projectId_fkey";

-- AlterTable
ALTER TABLE "public"."Module" DROP COLUMN "projectId";

-- CreateTable
CREATE TABLE "public"."ProjectModule" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "ProjectModule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectModule_projectId_moduleId_key" ON "public"."ProjectModule"("projectId", "moduleId");

-- AddForeignKey
ALTER TABLE "public"."ProjectModule" ADD CONSTRAINT "ProjectModule_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectModule" ADD CONSTRAINT "ProjectModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
