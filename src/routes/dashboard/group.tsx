import { AnimatedGrid } from "@/components/animated-grid";
import { CreateGroupForm } from "@/components/features/group/create-form";
import { GroupCard } from "@/components/features/group/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { createFileRoute } from "@tanstack/react-router";
import { groupGetAllQuery } from "@/queries/group";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/dashboard/group")({
	loader: async ({ context }) => {
		const groups = await context.queryClient.ensureQueryData(groupGetAllQuery);
		return groups;
	},
	component: RouteComponent,
});

function RouteComponent() {
	const groupAllResult = useSuspenseQuery(groupGetAllQuery);
	const groupAll = groupAllResult.data;

	return (
		<>
			<div className="flex flex-row items-center gap-2">
				<SidebarTrigger />
				<h1 className="font-bold text-xl">Groups</h1>
				<CreateGroupForm />
			</div>
			<Separator />
			<AnimatedGrid objects={groupAll} render={(group) => <GroupCard group={group} />} />
		</>
	);
}
