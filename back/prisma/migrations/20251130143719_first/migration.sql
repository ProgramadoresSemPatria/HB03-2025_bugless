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

-- CreateTable
CREATE TABLE "cli_session" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "token" TEXT,
    "user_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cli_session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cli_session_session_id_key" ON "cli_session"("session_id");

-- AddForeignKey
ALTER TABLE "cli_session" ADD CONSTRAINT "cli_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
