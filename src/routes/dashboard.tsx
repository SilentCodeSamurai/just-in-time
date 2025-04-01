import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { DashboardNav } from "@/components/dashboard-nav";

export const Route = createFileRoute("/dashboard")({
	component: Layout,
	beforeLoad: async ({ context }) => {
		if (!context.userSession) {
			throw redirect({ to: "/sign-in" });
		}
	},
});

function Layout() {
	const { userSession } = Route.useRouteContext();
	return (
		<>
			<DashboardNav email={userSession?.email ?? "Who are you?"} />
			<main className="relative flex flex-col gap-2 mb-12 lg:mb-0 p-2 w-full min-h-svh">
				<Outlet />
			</main>
		</>
	);
}
