import { TagCreateInputSchema, TagDeleteInputSchema, TagUpdateInputSchema } from "./schemas";

import { z } from "zod";

export type TagCreateInputDTO = z.infer<typeof TagCreateInputSchema>;
export type TagUpdateInputDTO = z.infer<typeof TagUpdateInputSchema>;
export type TagDeleteInputDTO = z.infer<typeof TagDeleteInputSchema>;
