import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { userSession } = Route.useRouteContext();

	return (
		<>
			<div className="flex flex-col justify-center items-center space-y-8 h-full">
				<Logo size="lg" animate="always" />
				{userSession ? (
					<Button asChild className="w-40 md:w-60 lg:w-70">
						<Link to="/dashboard" viewTransition={true}>
							Dashboard
						</Link>
					</Button>
				) : (
					<>
						<p className="text-muted-foreground text-sm md:text-xl lg:text-3xl">
							Create an account to get started!
						</p>
						<div className="flex flex-col space-y-4">
							<Button asChild className="w-40 md:w-50 lg:w-70">
								<Link to="/sign-up" viewTransition={true}>
									Sign Up
								</Link>
							</Button>
						</div>
					</>
				)}
			</div>
		</>
	);
}
