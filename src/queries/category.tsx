import { categoryCreateServerFn, categoryGetAllServerFn, categoryGetListServerFn } from "@/server/category";

import { queryOptions } from "@tanstack/react-query";

export const categoryGetAllQuery = queryOptions({
	queryKey: ["category", "all"],
	queryFn: categoryGetAllServerFn,
	staleTime: Infinity,
});

export const categoryGetListQuery = queryOptions({
	queryKey: ["category", "list"],
	queryFn: categoryGetListServerFn,
	staleTime: Infinity,
});
