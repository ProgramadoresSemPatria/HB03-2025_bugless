import { Prisma } from "../generated/prisma/client";
import prisma from "../database/prisma";

type Decimal = Prisma.Decimal

interface PlanRequest {
  id?: string;
  name?: string;
  price?: Decimal | number | string;
  requestPerDay: number;
  allowPrivateRepo: boolean;
  privacyMode: boolean;
  statusPlanId: string;
}

class PlanService {
    async createPlan({name, price, requestPerDay, allowPrivateRepo, privacyMode, statusPlanId}: PlanRequest){
       if (!name || price === undefined || price === null) {
            throw new Error("The plan name and price are required!")
        }

        const plan = await prisma.plan.create({
            data: {
                name,
                price,
                requestPerDay,
                allowPrivateRepo,
                privacyMode,
                statusPlanId
            },
        });
        return plan;
    }

   async getAllPlan() {
    const plan = await prisma.plan.findMany({
        include: {
        statusPlan: { 
            select: {
                id: true,
                name: true,
            }
        },
        }
    });
    return plan;
}

    async updatePlan({ id, name, price, requestPerDay, allowPrivateRepo, privacyMode, statusPlanId }: PlanRequest) {
      const plan = await prisma.plan.update({
        where: {id},
        data:{
            name,
            price,
            requestPerDay,
            allowPrivateRepo,
            privacyMode,
            statusPlanId,
        }
    });
    return plan;
    }

    async deletePlan(id: string){
        await prisma.plan.delete({
            where: {id},
        });
        return {message: "Plan sucessfully deleted!"}
    }
    
}

export default new PlanService();