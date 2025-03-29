import { TodoCreateInputSchema, TodoUpdateInputSchema } from "@/services/todo/schemas";

import { TodoService } from "@/services/todo/service";
import authorizedMiddleware from "@/middleware/authorized";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const todoCreateServerFn = createServerFn({
	method: "POST",
})
	.middleware([authorizedMiddleware])
	.validator((data: unknown) => TodoCreateInputSchema.parse(data))
	.handler(async ({ data, context }) => {
		const todo = await TodoService.create(data, context.user.id);
		return todo;
	});

export const todoGetByIdServerFn = createServerFn({
	method: "GET",
})
	.middleware([authorizedMiddleware])
	.validator((data: unknown) => z.object({ id: z.string() }).parse(data))
	.handler(async ({ data, context }) => {
		const todo = await TodoService.getById(data.id, context.user.id);
		return todo;
	});

export const todoGetAllServerFn = createServerFn({
	method: "GET",
})
	.middleware([authorizedMiddleware])
	.handler(async ({ context }) => {
		const todos = await TodoService.getAll(context.user.id);
		return todos;
	});

export const todoUpdateServerFn = createServerFn({
	method: "POST",
})
	.middleware([authorizedMiddleware])
	.validator((data: unknown) => TodoUpdateInputSchema.parse(data))
	.handler(async ({ data, context }) => {
		const todo = await TodoService.update(data, context.user.id);
		return todo;
	});

export const todoDeleteServerFn = createServerFn({
	method: "POST",
})
	.middleware([authorizedMiddleware])
	.validator((data: unknown) => z.object({ id: z.string() }).parse(data))
	.handler(async ({ data, context }) => {
		const success = await TodoService.delete(data.id, context.user.id);
		return { success };
	});
