// app/routes/__root.tsx

import { HeadContent, Outlet, Scripts, useLayoutEffect } from "@tanstack/react-router";

import { QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeColorProvider } from "@/hooks/use-theme-color";
import { Toaster } from "@/components/ui/sonner";
import appCss from "@/styles/globals.css?url";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { userGetSessionServerFn } from "@/server/user";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	beforeLoad: async () => {
		const userSession = await userGetSessionServerFn();
		return { userSession };
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "JustInTime",
			},
		],
		links: [
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "96x96",
				href: "/favicon-96x96.png",
			},
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg",
			},
			{ rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
			{ rel: "shortcut icon", href: "/favicon.ico" },
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com",
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Hubot+Sans:ital,wght@0,200..900;1,200..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swapp",
			},
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<RootDocument>
				<ThemeColorProvider>
					<Outlet />
				</ThemeColorProvider>
			</RootDocument>
		</>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="relative min-h-svh">
				<div className="z-[-1] absolute inset-0 bg-gradient-to-r from-background to-primary opacity-10 h-full" />
				{children}
				<TanStackRouterDevtools position="bottom-right" />
				<ReactQueryDevtools buttonPosition="bottom-left" />
				<Scripts />
				<Toaster />
			</body>
		</html>
	);
}
