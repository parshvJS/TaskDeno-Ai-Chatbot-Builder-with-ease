import { z } from "zod";

export const nodeSchema = z.object({
    nodeName: z.string()
})