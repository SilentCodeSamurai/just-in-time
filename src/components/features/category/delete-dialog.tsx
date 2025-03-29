import { CategoryAllItem, CategoryListItem } from "@/types/category";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { categoryDeleteServerFn } from "@/server/category";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

type CategoryDeleteDialogProps = {
	category: CategoryAllItem;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function CategoryDeleteDialog({ category, open, onOpenChange }: CategoryDeleteDialogProps) {
	const queryClient = useQueryClient();
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
		onError: (error) => {
			toast.error(`Failed to delete category: ${error}`);
		},
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete {category.name}?</DialogTitle>
					<DialogDescription>This action cannot be undone. This will delete the item.</DialogDescription>
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
	);
}
