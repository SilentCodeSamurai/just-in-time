import { SignUpForm } from "@/components/features/auth/sign-up-form";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_auth/sign-up")({
	component: RouteComponent,
});

function RouteComponent() {
	return <SignUpForm />;
}
