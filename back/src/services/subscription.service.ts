import { Prisma } from "../generated/prisma/client";
import prisma from "../database/prisma";

interface SubscriptionRequest {
  id?: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  status: string;
  price: Decimal | number | string;
  userId: string;
  planId: string;
}


interface UpdateSubscriptionRequest {
  id: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  status: string;
  price: Decimal | number | string;
  userId: string;
  planId: string;
}

type Decimal = Prisma.Decimal;

class SubscriptionService {
    async createSubscription({
    startDate,
    endDate,
    status,
    price,
    userId,
    planId
    }: SubscriptionRequest){
         if (!startDate || !status || !price || !userId || !planId) {
      throw new Error("Missing required fields for Subscription!");
    }
    const subscription = await prisma.subscription.create({
        data: {
            startDate,
            endDate,
            status,
            price,
            userId,
            planId
        },
    });
    return subscription;
    }
async getAllSubscription() {
    const subscription = await prisma.subscription.findMany({
        include: {
            user: { 
                select: {
                    id: true,
                    email: true,
                }
            },
            plan: { 
                select: {
                    id: true,
                    name: true,
                    price: true,
                    requestPerDay: true,
                    allowPrivateRepo: true,
                    privacyMode: true,
                    statusPlanId: true,
                    
                    statusPlan: { 
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            }
        }
    });
    return subscription;
}

    async updateSubscription ({
        id, 
        startDate,
        endDate,
        status,
        price,
        userId,
        planId
    }: UpdateSubscriptionRequest) {
    const subscription = await prisma.subscription.update({
        where: {id},
        data: {
            startDate,
            endDate,
            status,
            price,
            userId,
            planId
                },
            });
            return subscription;
        }
        
        async deleteSubscription(id: string){
            await prisma.subscription.delete({
                where: {id},
            });
            return {message: "Subscription successfully deleted!"}
        }
}

export default new SubscriptionService();
