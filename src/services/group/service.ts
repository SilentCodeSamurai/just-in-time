import { GroupCreateInputDTO, GroupUpdateInputDTO } from "./dto";

import { prisma } from "@/lib/prisma";

export class GroupService {
	static async create(input: GroupCreateInputDTO, userId: string) {
		const group = await prisma.todoGroup.create({
			data: { ...input, user: { connect: { id: userId } } },
			include: {
				_count: {
					select: {
						todos: true,
					},
				},
			},
		});
		return group;
	}

	static async getAll(userId: string) {
		const groups = await prisma.todoGroup.findMany({
			where: { userId },
			include: {
				_count: {
					select: {
						todos: true,
					},
				},
			},
			orderBy: {
				name: "asc",
			},
		});
		return groups;
	}

	static async getList(userId: string) {
		const groups = await prisma.todoGroup.findMany({
			where: { userId },
			select: {
				id: true,
				name: true,
			},
		});
		return groups;
	}

	static async update(input: GroupUpdateInputDTO, userId: string) {
		const group = await prisma.todoGroup.update({
			where: { id: input.id, userId },
			data: input,
			include: {
				_count: {
					select: {
						todos: true,
					},
				},
			},
		});
		return group;
	}

	static async delete(id: string, userId: string) {
		await prisma.todoGroup.delete({
			where: { id, userId },
		});
		return true;
	}
}
