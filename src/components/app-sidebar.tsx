import { Bookmark, Box, LayoutDashboard, List, LogOut, Tag } from "lucide-react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useCallback, useEffect } from "react";

import { Button } from "./ui/button";
import { Logo } from "./logo";

const items = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "TODO",
		url: "/dashboard/todo",
		icon: Bookmark,
	},
	{
		title: "Categories",
		url: "/dashboard/category",
		icon: List,
	},
	// {
	// 	title: "Tags",
	// 	url: "#",
	// 	icon: Tag,
	// },
	{
		title: "Groups",
		url: "/dashboard/group",
		icon: Box,
	},
];

type AppSidebarProps = {
	email: string;
};

export function AppSidebar({ email }: AppSidebarProps) {
	const { setOpenMobile } = useSidebar()
	const router = useRouter()

	useEffect(() => {
		if (router.state) {
			setOpenMobile(false)
		}
	}, [router.state, setOpenMobile])
	
	return (
		<Sidebar variant="floating">
			<SidebarHeader>
				<div className="flex flex-row justify-center items-center gap-2">
					<Button asChild variant="ghost">
						<Link to="/" viewTransition={true}>
							<Logo size="sm" animate="hover" />
						</Link>
					</Button>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild >
										<Link to={item.url} viewTransition={true}>
											<item.icon className="text-primary" />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarGroup>
						<SidebarGroupContent>
							<p className="overflow-hidden font-bold text-primary text-sm text-ellipsis">{email}</p>
							<SidebarMenuItem className="flex justify-start">
								<SidebarMenuButton asChild>
									<Button asChild variant="destructive" className="size-8">
										<Link to="/logout">
											<LogOut className="size-4" />
										</Link>
									</Button>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
