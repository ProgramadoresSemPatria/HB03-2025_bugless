/*
  Warnings:

  - Added the required column `submission_mode` to the `submission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubmissionModeEnum" AS ENUM ('PR_DIFF', 'UNCOMMITTED', 'COMMIT', 'CUSTOM');

-- AlterTable
ALTER TABLE "submission" ADD COLUMN     "submission_mode" "SubmissionModeEnum" NOT NULL;

-- DropEnum
DROP TYPE "SubmissionMode";
