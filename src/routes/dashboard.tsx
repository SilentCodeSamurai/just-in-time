import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/app-sidebar";

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
		<SidebarProvider>
			<AppSidebar email={userSession?.email ?? "Who are you?"} />
			<main className="flex flex-col gap-2 p-2 w-full h-svh">
				<Outlet />
			</main>
		</SidebarProvider>
	);
}
