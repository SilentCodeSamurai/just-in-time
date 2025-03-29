import { createFileRoute, redirect } from "@tanstack/react-router";

import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "@/lib/session";

const logoutFn = createServerFn().handler(async () => {
	const session = await useAppSession();

	session.clear();

	throw redirect({
		href: "/",
		viewTransition: true,
	});
});

export const Route = createFileRoute("/logout")({
	preload: false,
	loader: () => logoutFn(),
});
