/*
  Warnings:

  - You are about to drop the column `language` on the `project` table. All the data in the column will be lost.
  - Added the required column `name_user` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubmissionMode" AS ENUM ('PR_DIFF', 'UNCOMMITTED', 'COMMIT', 'CUSTOM');

-- AlterTable
ALTER TABLE "project" DROP COLUMN "language",
ADD COLUMN     "language_project" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "name_user" TEXT NOT NULL;
