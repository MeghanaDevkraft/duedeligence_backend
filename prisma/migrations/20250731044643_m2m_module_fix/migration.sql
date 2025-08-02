-- AlterTable
ALTER TABLE "public"."Module" ADD COLUMN     "projectId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Module" ADD CONSTRAINT "Module_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
