import { useSession } from "@tanstack/react-start/server";

type SessionUser = {
	user: {
		id: string;
		email: string;
	} | null;
};

export function useAppSession() {
	return useSession<SessionUser>({
		password: process.env.SESSION_PASSWORD || "",
	});
}
