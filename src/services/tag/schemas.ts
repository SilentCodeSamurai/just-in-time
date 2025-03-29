import { z } from "zod";

export const TagCreateInputSchema = z.object({
	name: z.string(),
	color: z.string().optional(),
});

export const TagUpdateInputSchema = z.object({
	id: z.string().min(1, { message: "Id is required" }),
	name: z.string().optional(),
	color: z.string().optional(),
});

export const TagDeleteInputSchema = z.object({
	id: z.string().min(1, { message: "Id is required" }),
});
