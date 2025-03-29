"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, CalendarIcon, ChevronDown, Filter, X } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { PriorityBadge } from "./priority-badges";
import { TodoAllItem } from "@/types/todo";
import type { TodoSearch } from "@/routes/dashboard/todo";
import { categoryGetAllQuery } from "@/queries/category";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { groupGetAllQuery } from "@/queries/group";
import { useSuspenseQuery } from "@tanstack/react-query";

type RemoveUndefined<T> = T extends undefined ? never : T;

type Sorting = RemoveUndefined<TodoSearch["sorting"]>;
type Filter = RemoveUndefined<TodoSearch["filter"]>;

const sortingOptions: Map<Sorting["sortBy"], string> = new Map([
	["priority", "Priority"],
	["dueDate", "Deadline"],
	["createdAt", "Created"],
]);

const routeApi = getRouteApi("/dashboard/todo");

export function TodoFilters() {
	const categoriesResult = useSuspenseQuery(categoryGetAllQuery);
	const groupsResult = useSuspenseQuery(groupGetAllQuery);
	const categories = categoriesResult.data;
	const groups = groupsResult.data;

	const { sorting, filter } = routeApi.useSearch();
	const navigate = useNavigate({ from: "/dashboard/todo" });

	const [isFiltersOpen, setIsFiltersOpen] = useState(false);

	const date = useMemo(() => {
		const dueDate = filter?.dueDate;
		return dueDate ? new Date(dueDate) : undefined;
	}, [filter]);

	const hasActiveFilters = Object.keys(filter || {}).length > 0;
	const hasActiveSorting = Object.keys(sorting || {}).length > 0;

	const handleSortByChange = (sortBy: Sorting["sortBy"]) => {
		navigate({
			to: ".",
			search: (prev) => {
				let newSortOrder: "asc" | "desc" = "asc";
				if (!prev.sorting) {
					return {
						...prev,
						sorting: {
							sortBy: sortBy,
							sortOrder: newSortOrder,
						},
					};
				} else if (prev.sorting.sortBy === sortBy) {
					if (prev.sorting.sortOrder === "asc") {
						newSortOrder = "desc";
					} else {
						newSortOrder = "asc";
					}
					return {
						...prev,
						sorting: {
							sortBy: sortBy,
							sortOrder: newSortOrder,
						},
					};
				} else {
					return {
						...prev,
						sorting: {
							sortBy: sortBy,
							sortOrder: newSortOrder,
						},
					};
				}
			},
		});
	};

	type FilterKey = keyof Filter;

	const handleToggleFilter = (key: FilterKey, value: Filter[FilterKey] | "all") => {
		navigate({
			to: ".",
			search: (prev) => {
				const newFilter = { ...prev.filter };
				if (value === "all") {
					delete newFilter[key];
				} else {
					Object.assign(newFilter, { [key]: value });
				}
				if (Object.keys(newFilter).length === 0) {
					return { ...prev, filter: undefined };
				}
				return { ...prev, filter: newFilter };
			},
		});
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-row items-center gap-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="justify-start w-[120px]">
							{sorting && sorting.sortBy ? (
								<>
									{sorting.sortOrder === "asc" ? (
										<ArrowUp className="w-4 h-4 text-primary" />
									) : (
										<ArrowDown className="w-4 h-4 text-primary" />
									)}
									{sortingOptions.get(sorting.sortBy)}
								</>
							) : (
								<>
									<ArrowUpDown className="w-4 h-4" />
									<span className="text-sm">Sort by</span>
								</>
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						{Array.from(sortingOptions.entries()).map(([key, label]) => (
							<DropdownMenuItem key={key} onClick={() => handleSortByChange(key as Sorting["sortBy"])}>
								{label}
								{sorting?.sortBy === key && (
									<span className="ml-2">{sorting?.sortOrder === "asc" ? "↑" : "↓"}</span>
								)}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				{hasActiveSorting && (
					<Button
						variant="ghost"
						size="icon"
						onClick={() => {
							navigate({
								to: ".",
								search: (prev) => ({
									...prev,
									sorting: undefined,
								}),
							});
						}}
						title="Clear sorting"
					>
						<X className="w-4 h-4" />
					</Button>
				)}
			</div>
			<div className="flex flex-col gap-2">
				<div className="flex flex-row items-center gap-2 w-fit">
					<Button
						variant="outline"
						onClick={() => setIsFiltersOpen(!isFiltersOpen)}
						className="justify-between w-[120px]"
					>
						<div className="flex items-center gap-2">
							<Filter
								className={cn(
									"w-4 h-4 transition-colors duration-200",
									hasActiveFilters && "text-primary"
								)}
							/>
							<span>Filters</span>
						</div>
						<ChevronDown
							className={cn(
								"w-4 h-4 transition-transform duration-200",
								isFiltersOpen ? "rotate-180" : ""
							)}
						/>
					</Button>

					{hasActiveFilters && (
						<Button
							variant="ghost"
							size="icon"
							onClick={() => {
								navigate({
									to: ".",
									search: (prev) => ({
										...prev,
										filter: undefined,
									}),
								});
							}}
							className="ml-auto"
							title="Clear all filters"
						>
							<X className="w-4 h-4" />
						</Button>
					)}
				</div>

				<div
					className={cn(
						"grid gap-4 transition-all duration-200 origin-top mt-2",
						isFiltersOpen
							? "animate-in slide-in-from-top-2 grid-rows-[1fr]"
							: "animate-out slide-out-to-top-2 grid-rows-[0fr]"
					)}
				>
					<div className="overflow-hidden">
						<div className="gap-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 xl:grid-cols-3">
							<div className="flex flex-col gap-2 w-full">
								<Label>Priority</Label>
								<Select
									value={filter?.priority?.toString() || "all"}
									onValueChange={(value) =>
										handleToggleFilter("priority", value === "all" ? "all" : parseInt(value))
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Filter by priority" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All</SelectItem>
										{[1, 2, 3, 4].map((priority) => (
											<SelectItem key={priority} value={priority.toString()}>
												<PriorityBadge priority={priority} />
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col gap-2 w-full">
								<Label>Category</Label>
								<Select
									value={filter?.categoryId || "all"}
									defaultValue="all"
									onValueChange={(value) => handleToggleFilter("categoryId", value)}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Filter by category" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											<div className="flex items-center gap-2">
												<div className="bg-muted rounded-full size-3" />
												<span>All</span>
											</div>
										</SelectItem>
										{categories.map((category) => (
											<SelectItem key={category.id} value={category.id}>
												<div className="flex items-center gap-2">
													<div
														className="rounded-full size-3"
														style={{ backgroundColor: category.color || "inherit" }}
													/>
													<span>{category.name}</span>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col gap-2">
								<Label>Group</Label>
								<Select
									value={filter?.groupId || "all"}
									onValueChange={(value) => handleToggleFilter("groupId", value)}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Filter by group" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All</SelectItem>
										{groups.map((group) => (
											<SelectItem key={group.id} value={group.id}>
												{group.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col gap-2">
								<Label>Status</Label>
								<Select
									value={
										filter?.completed !== undefined
											? filter?.completed
												? "completed"
												: "active"
											: "all"
									}
									defaultValue="all"
									onValueChange={(value) =>
										handleToggleFilter("completed", value === "all" ? "all" : value === "completed")
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Filter by status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All</SelectItem>
										<SelectItem value="completed">Completed</SelectItem>
										<SelectItem value="active">Active</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col gap-2">
								<Label>Deadline</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={cn(
												"w-full justify-start text-left font-normal",
												!date && "text-muted-foreground"
											)}
										>
											<CalendarIcon className="mr-2 w-4 h-4" />
											{date ? `${format(date, "PPP")}` : "Expires before"}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="p-0 w-auto" align="start">
										<Calendar
											mode="single"
											selected={date}
											onSelect={(value) => handleToggleFilter("dueDate", value?.toISOString())}
										/>
									</PopoverContent>
								</Popover>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function useTodoFilter(): (todoAll: TodoAllItem[]) => TodoAllItem[] {
	const { sorting, filter } = routeApi.useSearch();

	return (todoAll: TodoAllItem[]) => {
		let result: TodoAllItem[] = todoAll;

		if (filter) {
			result = todoAll.filter((todo) => {
				for (const [filterKey, filterValue] of Object.entries(filter)) {
					const key = filterKey as keyof Filter;
					if (key === "dueDate" && filterValue !== undefined && todo.dueDate !== null) {
						const dueDate = new Date(filterValue as string);
						if (dueDate < todo.dueDate) {
							return false;
						}
					} else if (filterValue !== undefined && todo[key] !== filterValue) {
						return false;
					}
				}
				return true;
			});
		}

		if (sorting) {
			const sortBy = sorting.sortBy;
			if (sortBy) {
				result = result.sort((a, b) => {
					const aValue = a[sortBy];
					const bValue = b[sortBy];
					if (aValue && bValue) {
						return sorting.sortOrder === "asc"
							? Number(aValue) - Number(bValue)
							: Number(bValue) - Number(aValue);
					} else if (aValue && !bValue) {
						return -1;
					} else if (!aValue && bValue) {
						return 1;
					}
					return 0;
				});
			}
		} else {
			result = result.sort((a, b) => {
				return a.createdAt.getTime() - b.createdAt.getTime();
			});
		}

		return result;
	};
}
