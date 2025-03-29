import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (context.userSession) {
			return redirect({ to: "/dashboard" });
		}
	},
});

function RouteComponent() {
	return (
		<div className="flex flex-col justify-center items-center h-full">
			<Outlet />
		</div>
	);
}
