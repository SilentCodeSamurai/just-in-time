import { AnimatedGrid } from "@/components/animated-grid";
import { CategoryCard } from "@/components/features/category/card";
import { CreateCategoryForm } from "@/components/features/category/create-form";
import { categoryGetAllQuery } from "@/queries/category";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/dashboard/category")({
	loader: async ({ context }) => {
		const categories = await context.queryClient.ensureQueryData(categoryGetAllQuery);
		return categories;
	},
	component: RouteComponent,
});

function RouteComponent() {
	const categoryAllResult = useSuspenseQuery(categoryGetAllQuery);
	const categoryAll = categoryAllResult.data;

	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="flex flex-row items-center gap-2">
					<h1 className="font-bold text-xl">Categories: {categoryAll.length}</h1>
					<CreateCategoryForm />
				</div>

				<AnimatedGrid objects={categoryAll} render={(category) => <CategoryCard category={category} />} />
			</div>
		</>
	);
}
