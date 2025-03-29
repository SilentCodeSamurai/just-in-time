"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryAllItem, CategoryListItem } from "@/types/category";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { ExternalLink, Trash } from "lucide-react";
import { motion, useAnimation } from "motion/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { CategoryUpdateForm } from "./update-form";
import { Link } from "@tanstack/react-router";
import { categoryDeleteServerFn } from "@/server/category";
import { toast } from "sonner";

export function CategoryCard({ category }: { category: CategoryAllItem }) {
	const queryClient = useQueryClient();
	const controls = useAnimation();

	const deleteMutation = useMutation({
		mutationFn: categoryDeleteServerFn,
		onSuccess: () => {
			queryClient.setQueryData(["category", "all"], (old: CategoryAllItem[]) => {
				return old.filter((c) => c.id !== category.id);
			});
			queryClient.setQueryData(["category", "list"], (old: CategoryListItem[]) => {
				return old.filter((c) => c.id !== category.id);
			});
			toast.success("Category deleted");
		},
		onError: () => {
			toast.error("Failed to delete category");
		},
	});

	const handleUpdateSuccess = () => {
		controls.start({
			scale: [1, 1.01, 1],
			transition: { duration: 0.2 },
		});
	};

	return (
		<>
			<motion.div animate={controls}>
				<Card key={category.id} className={`w-full relative`}>
					<div
						style={{ height: "calc(100% + 2px)" }}
						className="-top-[1px] right-0 bottom-0 -left-[1px] absolute border-1 border-transparent rounded-xl overflow-hidden pointer-events-none"
					>
						<div
							style={{
								zIndex: 0,
								position: "absolute",
								top: 0,
								left: "-5px",
								width: "20px",
								height: "100%",
								background: `linear-gradient(to right, ${category?.color || "gray"} 0%, transparent 100%)`,
							}}
						></div>
					</div>
					<CardHeader>
						<div className="flex flex-row justify-between items-center gap-2">
							<div className="flex flex-row items-center gap-2">
								<div
									className="rounded-full size-4"
									style={{ backgroundColor: category.color || "inherit" }}
								/>
							</div>
							<div className="flex flex-row items-center gap-2">
								<CategoryUpdateForm category={category} onSuccess={handleUpdateSuccess} />
								<Dialog>
									<DialogTrigger asChild>
										<Button type="button" variant="destructive" className="size-8">
											<Trash className="size-4" />
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Delete item ?</DialogTitle>
											<DialogDescription>
												This action cannot be undone. This will delete the item.
											</DialogDescription>
										</DialogHeader>
										<DialogFooter>
											<Button
												type="button"
												variant="destructive"
												onClick={() => deleteMutation.mutate({ data: { id: category.id } })}
												disabled={deleteMutation.status === "pending"}
											>
												Delete
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</div>
						</div>

						<CardTitle className="text-xl">{category.name}</CardTitle>

						<CardDescription>{category.description}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-row items-center gap-4 mt-4">
							<p className="text-md">TODOS: {category._count.todos}</p>
							{category._count.todos > 0 && (
								<Button asChild type="button" variant="outline" className="size-8">
									<Link
										to="/dashboard/todo"
										search={{ filter: { categoryId: category.id } }}
										viewTransition={true}
									>
										<ExternalLink className="size-4" />
									</Link>
								</Button>
							)}
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</>
	);
}
