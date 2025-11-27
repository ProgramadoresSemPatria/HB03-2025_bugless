import { z } from "zod";

// Rules for the user schema
const idRule = z.string().min(1);
const emailRule = z.email();
const passwordRule = z.string().min(8);
const nameRule = z.string().min(1);

export const userSchema = z.object({
    name: nameRule,
    email: emailRule,
    password: passwordRule,
});

export type UserSchema = z.infer<typeof userSchema>;

export const getUserByIdSchema = z.object({
    id: idRule,
});

export type GetUserByIdSchema = z.infer<typeof getUserByIdSchema>;

export const getUserByEmailSchema = z.object({
    email: emailRule,
});

export type GetUserByEmailSchema = z.infer<typeof getUserByEmailSchema>;