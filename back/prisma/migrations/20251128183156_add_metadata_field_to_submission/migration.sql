/*
  Warnings:

  - You are about to drop the column `submission_mode` on the `submission` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SubmissionMode" AS ENUM ('PR_DIFF', 'UNCOMMITTED', 'COMMIT', 'CUSTOM');

-- AlterTable
ALTER TABLE "status_submission" ALTER COLUMN "name_status_submission" DROP DEFAULT;

-- AlterTable
ALTER TABLE "submission" DROP COLUMN "submission_mode",
ADD COLUMN     "metadata" JSONB;

-- DropEnum
DROP TYPE "SubmissionModeEnum";
