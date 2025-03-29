import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-row items-center gap-2">
				<h1 className="font-bold text-xl">Dashboard</h1>
			</div>
		</div>
	);
}
