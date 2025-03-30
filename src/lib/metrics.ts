import { TodoAllItem } from "@/types/todo";
import { intlFormat } from "date-fns";

function getDateString(date: Date) {
	return date.toISOString().split("T")[0];
}

export function getMetricsTodoCompletionsCreations(todoAll: TodoAllItem[]) {
	let metrics: {
		date: string;
		completions: number;
		creations: number;
	}[] = [];

	for (const todo of todoAll) {
		const creationDate = getDateString(new Date(todo.createdAt));
		const completionDate = todo.completed && todo.completedAt ? getDateString(new Date(todo.completedAt)) : null;

		if (completionDate) {
			const existingMetric = metrics.find((m) => m.date === completionDate);
			if (existingMetric) {
				existingMetric.completions++;
			} else {
				metrics.push({
					completions: 1,
					creations: 0,
					date: completionDate,
				});
			}
		}
		if (creationDate) {
			const existingMetric = metrics.find((m) => m.date === creationDate);
			if (existingMetric) {
				existingMetric.creations++;
			} else {
				metrics.push({
					completions: 0,
					creations: 1,
					date: creationDate,
				});
			}
		}
	}

	return metrics.map((m) => ({
		...m,
		date: new Date(m.date),
	})).sort((a, b) => a.date.getTime() - b.date.getTime()).map((m) => ({
		...m,
		date: intlFormat(m.date),
	}));
}
