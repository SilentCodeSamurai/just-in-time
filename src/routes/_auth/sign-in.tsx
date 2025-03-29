import { SignInForm } from "@/components/features/auth/sign-in-form";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_auth/sign-in")({
	component: RouteComponent,
});

function RouteComponent() {
	return <SignInForm />;
}
