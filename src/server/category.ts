import {
	CategoryCreateInputSchema,
	CategoryDeleteInputSchema,
	CategoryUpdateInputSchema,
} from "@/services/category/schemas";

import { CategoryService } from "@/services/category/service";
import authorizedMiddleware from "@/middleware/authorized";
import { createServerFn } from "@tanstack/react-start";

export const categoryCreateServerFn = createServerFn({
	method: "POST",
})
	.middleware([authorizedMiddleware])
	.validator((data: unknown) => CategoryCreateInputSchema.parse(data))
	.handler(async ({ data, context }) => {
		const category = await CategoryService.create(data, context.user.id);
		return category;
	});

export const categoryGetAllServerFn = createServerFn({
	method: "GET",
})
	.middleware([authorizedMiddleware])
	.handler(async ({ context }) => {
		const categories = await CategoryService.getAll(context.user.id);
		return categories;
	});

export const categoryGetListServerFn = createServerFn({
	method: "GET",
})
	.middleware([authorizedMiddleware])
	.handler(async ({ context }) => {
		const categories = await CategoryService.getList(context.user.id);
		return categories;
	});

export const categoryUpdateServerFn = createServerFn({
	method: "POST",
})
	.middleware([authorizedMiddleware])
	.validator((data: unknown) => CategoryUpdateInputSchema.parse(data))
	.handler(async ({ data, context }) => {
		const category = await CategoryService.update(data, context.user.id);
		return category;
	});

export const categoryDeleteServerFn = createServerFn({
	method: "POST",
})
	.middleware([authorizedMiddleware])
	.validator((data: unknown) => CategoryDeleteInputSchema.parse(data))
	.handler(async ({ data, context }) => {
		const success = await CategoryService.delete(data.id, context.user.id);
		return { success };
	});
