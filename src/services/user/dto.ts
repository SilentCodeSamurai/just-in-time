import { SignInInputSchema, SignUpInputSchema } from "./schemas";

import { z } from "zod";

export type SignUpInput = z.infer<typeof SignUpInputSchema>;
export type SignInInput = z.infer<typeof SignInInputSchema>;
