import { UserService } from "@/services/user/service";
import { createMiddleware } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { useAppSession } from "@/lib/session";

const authorizedMiddleware = createMiddleware().server(async ({ next }) => {
	const session = await useAppSession();
	if (!session.data.user) {
		throw redirect({ to: "/" });
	}
	const dbUser = await UserService.getUser(session.data.user.id);
	if (!dbUser) {
		await session.clear();
		throw redirect({ to: "/" });
	}
	const result = await next({
		context: {
			user: session.data.user,
		},
	});
	return result;
});

export default authorizedMiddleware;
