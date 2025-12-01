import prisma from "../database/prisma";

interface SubmissionRequest {
    codeContent: string;
    userId: string;
    projectId: string;
    statusSubmissionId: string;
}

interface UpdateSubmissionRequest {
    id: string;
    codeContent?: string;
    statusSubmissionId?: string;
}

class SubmissionService {
    async createSubmission({ codeContent, userId, projectId, statusSubmissionId }: SubmissionRequest) {

        if (!codeContent || !userId || !projectId || !statusSubmissionId) {
            throw new Error("All fields are required to create Submission!");
        }

        const submission = await prisma.submission.create({
            data: {
                codeContent,
                userId,
                projectId,
                statusSubmissionId
            }
        });

        return submission;
    }
  async getAllSubmission() {
    const submission = await prisma.submission.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                }
            },
            project: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                }
            },
            statusSubmission: { 
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    });
    return submission;
}

    async updateSubmission({ id, codeContent, statusSubmissionId }: UpdateSubmissionRequest) {
        const submission = await prisma.submission.update({
            where: { id },
            data: {
                codeContent,
                statusSubmissionId,
            },
        });

        return submission;
    }

    async deleteSubmission(id: string) {
        await prisma.submission.delete({
            where: { id },
        });

        return { message: "Submission successfully deleted!" };
    }
}

export default new SubmissionService();
