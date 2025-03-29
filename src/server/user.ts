import { SignInInputSchema, SignUpInputSchema } from "@/services/user/schemas";

import { UserService } from "@/services/user/service";
import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "@/lib/session";

type SignInServerFnResult = {
	success: { message: string } | false;
	error: { message: string; path: "email" | "password" | "root" } | null;
};

export const userGetSessionServerFn = createServerFn({
	method: "GET",
}).handler(async () => {
	const session = await useAppSession();
	return session.data?.user;
});

export const userSignUpServerFn = createServerFn({
	method: "POST",
})
	.validator((data: unknown) => SignUpInputSchema.parse(data))
	.handler(async ({ data }): Promise<SignInServerFnResult> => {
		try {
			const result = await UserService.signUp(data);
			if (!result.success) {
				return { success: false, error: result.error };
			}
			const session = await useAppSession();
			await session.update({
				user: {
					id: result.success.user.id,
					email: result.success.user.email,
				},
			});
			return { success: { message: result.success.message }, error: null };
		} catch (error) {
			if (error instanceof Error) {
				return { success: false, error: { message: error.message, path: "root" } };
			}
			return { success: false, error: { message: "Something went wrong", path: "root" } };
		}
	});

export const userSignInServerFn = createServerFn({
	method: "POST",
})
	.validator((data: unknown) => SignInInputSchema.parse(data))
	.handler(async ({ data }): Promise<SignInServerFnResult> => {
		try {
			const result = await UserService.signIn(data);
			if (!result.success) {
				return { success: false, error: result.error };
			}
			const session = await useAppSession();
			await session.update({
				user: {
					id: result.success.user.id,
					email: result.success.user.email,
				},
			});
			return { success: { message: result.success.message }, error: null };
		} catch (error) {
			if (error instanceof Error) {
				return { success: false, error: { message: error.message, path: "root" } };
			}
			return { success: false, error: { message: "Something went wrong", path: "root" } };
		}
	});
