import { SignInInput, SignUpInput } from "./dto";
import { comparePassword, hashPassword } from "@/lib/auth";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type AuthResult = {
	success: { user: Omit<User, "password">; message: string } | false;
	error: { message: string; path: "email" | "password" | "root" } | null;
};

export class UserService {

	static async getUser(id: string): Promise<User | null> {
		return await prisma.user.findUnique({ where: { id } });
	}

	static async signUp(
		input: SignUpInput
	): Promise<AuthResult> {
		const hashedPassword = await hashPassword(input.password);
        try {
            const user = await prisma.user.create({ 
                data: { 
                    email: input.email,
                    password: hashedPassword 
                },
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
                }
			});
			return { success: { user, message: "Welcome to the app!" }, error: null };
		} catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    return { success: false, error: { message: "User already exists", path: "email" } };
                }
            }
			return { success: false, error: { message: "Something went wrong", path: "root" } };
		}
	}

	static async signIn(input: SignInInput): Promise<AuthResult> {
		const user = await prisma.user.findUnique({ 
			where: { email: input.email },
			select: {
				id: true,
				email: true,
				password: true,
				createdAt: true,
				updatedAt: true
			}
		});
		if (!user) {
			return { success: false, error: { message: "User not found", path: "email" } };
		}
		const isPasswordValid = await comparePassword(input.password, user.password);
		if (!isPasswordValid) {
			return { success: false, error: { message: "Invalid password", path: "password" } };
		}
		const { password: _password, ...userWithoutPassword } = user;
		return { success: { user: userWithoutPassword, message: "Welcome!" }, error: null };
	}
}
