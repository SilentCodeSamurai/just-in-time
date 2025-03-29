import {
	SubtaskChangeStatusInputDTO,
	SubtaskCreateInputDTO,
	SubtaskUpdateInputDTO,
	TodoCreateInputDTO,
	TodoUpdateInputDTO,
} from "./dto";

import { prisma } from "@/lib/prisma";

export class TodoService {
	static async create(input: TodoCreateInputDTO, userId: string) {
		const { tagIds, subtasks, ...todoData } = input;
		const todo = await prisma.todo.create({
			data: {
				...todoData,
				user: { connect: { id: userId } },
				groupId: undefined,
				categoryId: undefined,
				group: todoData.groupId ? { connect: { id: todoData.groupId } } : undefined,
				category: todoData.categoryId ? { connect: { id: todoData.categoryId } } : undefined,
				tags: tagIds ? { connect: tagIds.map((id) => ({ id })) } : undefined,
				subtasks: subtasks
					? { create: subtasks.map((subtask) => ({ ...subtask, user: { connect: { id: userId } } })) }
					: undefined,
			},
			include: {
				category: true,
				group: true,
				tags: true,
				subtasks: true,
			},
		});
		return todo;
	}

	static async getAll(userId: string) {
		const todos = await prisma.todo.findMany({
			where: { userId },
			include: {
				tags: true,
				category: true,
				group: true,
				subtasks: true,
			},
		});

		return todos;
	}

	static async getById(id: string, userId: string) {
		const todo = await prisma.todo.findUnique({
			where: { id, userId },
		});
		return todo;
	}

	static async update(input: TodoUpdateInputDTO, userId: string) {
		const todo = await prisma.todo.update({
			where: { id: input.id, userId },
			data: { ...input, completedAt: input.completed ? new Date() : undefined },
			include: {
				tags: true,
				category: true,
				group: true,
				subtasks: true,
			},
		});
		return todo;
	}

	static async delete(id: string, userId: string) {
		await prisma.todo.delete({
			where: { id, userId },
		});
		return true;
	}

	// Subtask methods
	static async createSubtask(input: SubtaskCreateInputDTO) {
		// TODO: Implement database operation
		return input;
	}

	static async updateSubtask(input: SubtaskUpdateInputDTO) {
		// TODO: Implement database operation
		return input;
	}

	static async deleteSubtask(id: string) {
		// TODO: Implement database operation
		return { id };
	}

	static async changeSubtaskStatus(input: SubtaskChangeStatusInputDTO) {
		// TODO: Implement database operation
		return input;
	}
}
