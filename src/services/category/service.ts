import { CategoryCreateInputDTO, CategoryUpdateInputDTO } from "./dto";

import { prisma } from "@/lib/prisma";

export class CategoryService {
	static async create(input: CategoryCreateInputDTO, userId: string) {
		const category = await prisma.category.create({
			data: { ...input, user: { connect: { id: userId } } },
			include: {
				_count: {
					select: {
						todos: true,
					},
				},
			},
		});
		return category;
	}

	static async getById(id: string, userId: string) {
		const category = await prisma.category.findUnique({
			where: { id, userId },
		});
		return category;
	}

	static async getAll(userId: string) {
		const categories = await prisma.category.findMany({
			where: { userId },
			include: {
				_count: {
					select: {
						todos: true,
					},
				},
			},
		});
		return categories;
	}

	static async getList(userId: string) {
		const categories = await prisma.category.findMany({
			where: { userId },
			select: {
				id: true,
				name: true,
				color: true,
			},
		});
		return categories;
	}

	static async update(input: CategoryUpdateInputDTO, userId: string) {
		const category = await prisma.category.update({
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
		return category;
	}

	static async delete(id: string, userId: string) {
		await prisma.category.delete({
			where: { id, userId },
		});
		return true;
	}
}
