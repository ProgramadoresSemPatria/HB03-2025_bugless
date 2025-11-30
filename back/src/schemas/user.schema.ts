import { z } from "zod";
import { ulidRule } from "./common.schema";

// Rules for the user schema
const emailRule = z.email();
const passwordRule = z.coerce.string().min(8);
const nameRule = z.string().min(1);

export const userSchema = z.object({
    name: nameRule,
    email: emailRule,
    password: passwordRule,
});

export type UserSchema = z.infer<typeof userSchema>;

export const getUserByIdSchema = z.object({
    id: ulidRule,
});

export type GetUserByIdSchema = z.infer<typeof getUserByIdSchema>;

export const getUserByEmailSchema = z.object({
    email: emailRule,
});

export type GetUserByEmailSchema = z.infer<typeof getUserByEmailSchema>;

// Login schemas
export const loginSchema = z.object({
    email: emailRule,
    password: passwordRule,
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const cliSessionSchema = z.object({
    sessionId: z.string().uuid(),
});

export type CliSessionSchema = z.infer<typeof cliSessionSchema>;

export const cliLoginSchema = loginSchema.merge(cliSessionSchema);

export type CliLoginSchema = z.infer<typeof cliLoginSchema>;