/*
  Warnings:

  - The `name_status_submission` column on the `status_submission` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusSubmissionEnum" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "status_submission" 
  ALTER COLUMN "name_status_submission" TYPE "StatusSubmissionEnum" 
  USING ("name_status_submission"::text::"StatusSubmissionEnum");

-- Set default if needed (optional, but good practice if you want a default)
ALTER TABLE "status_submission" ALTER COLUMN "name_status_submission" SET DEFAULT 'PENDING';
