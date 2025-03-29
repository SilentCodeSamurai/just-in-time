import { todoCreateServerFn, todoGetAllServerFn } from "@/server/todo";

import { queryOptions } from "@tanstack/react-query";

export const todoGetAllQuery = queryOptions({
	queryKey: ["todo", "all"],
	queryFn: () => todoGetAllServerFn({}),
	staleTime: Infinity,
});
