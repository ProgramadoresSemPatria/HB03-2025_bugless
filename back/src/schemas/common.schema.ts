import { z } from "zod";

export const ulidRule = z.string().length(26);

export const paramsIdSchema = z.object({
  id: ulidRule,
});

export type ParamsIdSchema = z.infer<typeof paramsIdSchema>;