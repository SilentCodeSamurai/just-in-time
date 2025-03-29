import { groupCreateServerFn, groupGetAllServerFn, groupGetListServerFn } from "@/server/group";

import { queryOptions } from "@tanstack/react-query";

export const groupGetAllQuery = queryOptions({
	queryKey: ["group", "all"],
	queryFn: groupGetAllServerFn,
	staleTime: Infinity,
});

export const groupGetListQuery = queryOptions({
	queryKey: ["group", "list"],
	queryFn: groupGetListServerFn,
	staleTime: Infinity
});
