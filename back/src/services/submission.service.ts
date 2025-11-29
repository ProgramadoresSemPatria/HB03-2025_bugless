import prisma from "../database/prisma";
import { CreateSubmissionSchema, SubmissionIdRule } from "../schemas/submission.schema";
import { StatusSubmissionEnum, SubmissionModeEnum } from "../generated/prisma/enums";
import submissionWorker from "../workers/submission.worker"

class SubmissionService {
    async createSubmission(data: CreateSubmissionSchema) {

        const pendingStatus = await prisma.statusSubmission.findFirstOrThrow({
            where: { name: StatusSubmissionEnum.PENDING }
        });

        const submission = await prisma.submission.create({
            data: {
                codeContent: data.codeContent,
                submissionMode: data.submissionMode as SubmissionModeEnum,
                user: { connect: { id: data.userId } },
                project: { connect: { id: data.projectId } },
                statusSubmission: { connect: { id: pendingStatus.id } }
            }   
        });

        submissionWorker.processJob(submission);

        return submission;
    }

    async getSubmissionById(submissionData: SubmissionIdRule){
        const submission = await prisma.submission.findUnique({
            where: { id: submissionData },
            include: {
                statusSubmission: true,
                reviews: true
            }
        });

        if (!submission) {
            return null;
        }

        const { statusSubmissionId, statusSubmission, reviews, ...submissionRest } = submission;

        const submissionResponse = {
            ...submissionRest,
            statusSubmission: statusSubmission.name,
            review: statusSubmission.name === StatusSubmissionEnum.COMPLETED ? (reviews[0] ?? null) : null
        }

        return submissionResponse;
    }

    async updateSubmissionStatus(submissionId: string, status: StatusSubmissionEnum) {
        const statusRecord = await prisma.statusSubmission.findFirst({
            where: { name: status }
        });

        if (!statusRecord) {
            return null;
        }

        return await prisma.submission.update({
            where: { id: submissionId },
            data: { statusSubmissionId: statusRecord.id }
        });
    }
}

export default new SubmissionService();
