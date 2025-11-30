-- CreateTable
CREATE TABLE "github_installations" (
    "id" TEXT NOT NULL,
    "installation_id" TEXT NOT NULL,
    "account_login" TEXT NOT NULL,
    "account_type" TEXT NOT NULL,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "github_installations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_pull_requests" (
    "id" TEXT NOT NULL,
    "pr_number" INTEGER NOT NULL,
    "installation_id" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "head_ref" TEXT NOT NULL,
    "base_ref" TEXT NOT NULL,
    "commit_sha" TEXT NOT NULL,
    "submission_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "github_pull_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "github_installations_installation_id_key" ON "github_installations"("installation_id");

-- CreateIndex
CREATE UNIQUE INDEX "github_pull_requests_submission_id_key" ON "github_pull_requests"("submission_id");

-- CreateIndex
CREATE UNIQUE INDEX "github_pull_requests_owner_repo_pr_number_key" ON "github_pull_requests"("owner", "repo", "pr_number");

-- AddForeignKey
ALTER TABLE "github_installations" ADD CONSTRAINT "github_installations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "github_pull_requests" ADD CONSTRAINT "github_pull_requests_installation_id_fkey" FOREIGN KEY ("installation_id") REFERENCES "github_installations"("installation_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "github_pull_requests" ADD CONSTRAINT "github_pull_requests_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
