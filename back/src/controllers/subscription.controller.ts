import { Request, Response } from "express";
import subscriptionService from "../services/subscription.service";

class SubscriptionController {
    async create(req: Request, res: Response) {
        const { startDate, endDate,status,price,
userId, planId} = req.body;

    const subscription = await subscriptionService.createSubscription({
        startDate, endDate,status,price,
userId, planId
    });
    return res.json(subscription);
    }

    async getAllSubscription(req: Request, res: Response){
        const subscription = await subscriptionService.getAllSubscription();
        res.status(200).json(subscription)
    }


    async update(req: Request, res: Response){
        const id = req.params.id as string;
        const { startDate, endDate, status, price, userId, planId } = req.body;
        const subscription = await subscriptionService.updateSubscription({
            id,
            startDate, 
            endDate,
            status,
            price,
            userId, 
            planId
        });
        return res.json(subscription) 
    }

    async delete(req: Request, res: Response){
        const id = req.params.id as string;
        const msg = await subscriptionService.deleteSubscription(id);
        
        return res.json(msg);
    }
}

export default new SubscriptionController