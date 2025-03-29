import { TagCreateInputDTO, TagUpdateInputDTO } from "./dto";

import { prisma } from "@/lib/prisma";

export class TagService {
	static async create(input: TagCreateInputDTO, userId: string) {
		const tag = await prisma.tag.create({
			data: { ...input, user: { connect: { id: userId } } },
		});
		return tag;
	}

	static async getById(id: string, userId: string) {
		const tag = await prisma.tag.findUnique({
			where: { id, userId },
		});
		return tag;
	}

	static async getAll(userId: string) {
		const tags = await prisma.tag.findMany({
			where: { userId },
		});
		return tags;
	}

	static async update(input: TagUpdateInputDTO, userId: string) {
		const tag = await prisma.tag.update({
			where: { id: input.id, userId },
			data: input,
		});
		return tag;
	}

	static async delete(id: string, userId: string) {
		await prisma.tag.delete({
			where: { id, userId },
		});
		return true;
	}
}
