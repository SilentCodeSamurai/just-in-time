import {
	GroupCreateInputSchema,
	GroupUpdateInputSchema,
} from "@/services/group/schemas";

import { GroupService } from "@/services/group/service";
import authorizedMiddleware from "@/middleware/authorized";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const groupCreateServerFn = createServerFn({
	method: "POST",
})
	.middleware([authorizedMiddleware])
	.validator((data: unknown) => GroupCreateInputSchema.parse(data))
	.handler(async ({ data, context }) => {
		const group = await GroupService.create(data, context.user.id);
		return group;
	});

export const groupGetAllServerFn = createServerFn({
	method: "GET",
})
	.middleware([authorizedMiddleware])
	.handler(async ({ context }) => {
		const groups = await GroupService.getAll(context.user.id);
		return groups;
	});

export const groupGetListServerFn = createServerFn({
	method: "GET",
})
	.middleware([authorizedMiddleware])
	.handler(async ({ context }) => {
		const groups = await GroupService.getList(context.user.id);
		return groups;
	});

export const groupUpdateServerFn = createServerFn({
	method: "POST",
})
	.middleware([authorizedMiddleware])
	.validator((data: unknown) => GroupUpdateInputSchema.parse(data))
	.handler(async ({ data, context }) => {
		const group = await GroupService.update(data, context.user.id);
		return group;
	});

export const groupDeleteServerFn = createServerFn({
	method: "POST",
})
	.middleware([authorizedMiddleware])
	.validator((data: unknown) => z.object({ id: z.string() }).parse(data))
	.handler(async ({ data, context }) => {
		const success = await GroupService.delete(data.id, context.user.id);
		return { success };
	});
