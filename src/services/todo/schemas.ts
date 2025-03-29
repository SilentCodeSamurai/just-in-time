import { z } from "zod";

// Priority
export const PrioritySchema = z.number().min(1).max(4);
export type Priority = z.infer<typeof PrioritySchema>;

const validateDueDate = (dueDate: Date, now: Date) => {
	const dueDateDate = new Date(Date.UTC(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate()));
	const nowDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
	return dueDateDate >= nowDate;
};

// Todo
export const TodoGetAllInputSchema = z.object({
	filter: z
		.object({
			groupId: z.string().nullable().optional(),
			categoryId: z.string().nullable().optional(),
			tagIds: z.array(z.string()).optional(),
			priority: PrioritySchema.optional(),
			completed: z.boolean().optional(),
			dueDate: z.string().optional(),
		})
		.optional(),
	paging: z
		.object({
			limit: z.number().optional(),
			offset: z.number().optional(),
		})
		.optional(),
	sorting: z
		.object({
			sortBy: z.enum(["createdAt", "dueDate", "priority"]).optional(),
			sortOrder: z.enum(["asc", "desc"]).optional(),
		})
		.optional(),
});

export const TodoCreateInputSchema = z
	.object({
		title: z.string().min(1, { message: "Title is required" }),
		description: z.string().nullable(),
		priority: PrioritySchema.optional().default(2),
		dueDate: z.date().nullable(),
		groupId: z.string().nullable(),
		categoryId: z.string().nullable(),
		tagIds: z.array(z.string()).nullable(),
		subtasks: z.array(z.object({ title: z.string() })).nullable(),
		meta: z.object({
			now: z.date(),
		}),
	})
	.refine(
		(data) => {
			if (data.dueDate) {
				return validateDueDate(data.dueDate, data.meta.now);
			}
			return true;
		},
		{
			message: "Due date must be today or later",
			path: ["dueDate"],
		}
	);

export const TodoUpdateInputSchema = z
	.object({
		id: z.string().min(1, { message: "Id is required" }),
		completed: z.boolean().optional(),
		title: z.string().min(1, { message: "Title is required" }).optional(),
		description: z.string().nullable().optional(),
		priority: PrioritySchema.optional(),
		dueDate: z.date().nullable().optional(),
		categoryId: z.string().nullable().optional(),
		groupId: z.string().nullable().optional(),
		tagIds: z.array(z.string()).optional(),
		meta: z.object({
			now: z.date(),
		}),
	})
	.refine(
		(data) => {
			if (data.dueDate) {
				return validateDueDate(data.dueDate, data.meta.now);
			}
			return true;
		},
		{
			message: "Due date must be today or later",
			path: ["dueDate"],
		}
	);

export const TodoDeleteInputSchema = z.object({
	id: z.string().min(1, { message: "Id is required" }),
});

// Subtask
export const SubtaskCreateInputSchema = z.object({
	todoId: z.string(),
	title: z.string(),
});

export const SubtaskUpdateInputSchema = z.object({
	id: z.string(),
	title: z.string(),
});

export const SubtaskChangeStatusInputSchema = z.object({
	id: z.string(),
	completed: z.boolean(),
});
