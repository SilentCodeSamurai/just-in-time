import { ChartConfig, ChartTooltipContent } from "@/components/ui/chart";
import { ChartTooltip } from "@/components/ui/chart";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis } from "recharts";
import { getMetricsTodoCompletionsCreations } from "@/lib/metrics";
import { todoGetAllQuery } from "@/queries/todo";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

const chartCompletionsCreationsConfig = {
	completions: {
		label: "Completed",
		color: "#2563eb",
	},
	creations: {
		label: "Planned",
		color: "#60a5fa",
	},
} satisfies ChartConfig;

export const Route = createFileRoute("/dashboard/metrics")({
	component: RouteComponent,
});

function RouteComponent() {
	const todoAllResult = useSuspenseQuery(todoGetAllQuery);

	const todoAll = todoAllResult.data;

	const todoMetricsCompletionsCreations = useMemo(() => getMetricsTodoCompletionsCreations(todoAll), [todoAll]);
	return (
		<div>
			<div className="flex flex-col gap-2">
				<h2>Planned & Completed</h2>
				<ChartContainer config={chartCompletionsCreationsConfig} className="w-full min-h-[200px]">
					<BarChart accessibilityLayer data={todoMetricsCompletionsCreations}>
						<CartesianGrid vertical={false} />
						<ChartTooltip content={<ChartTooltipContent />} />
						<XAxis dataKey="date" />
						<Bar dataKey="creations" fill="#60a5fa" radius={4} />
						<Bar dataKey="completions" fill="var(--primary)" radius={4} />
					</BarChart>
				</ChartContainer>
			</div>
		</div>
	);
}
