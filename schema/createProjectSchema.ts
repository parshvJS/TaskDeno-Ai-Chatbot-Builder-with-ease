import { z } from "zod";

export const createProjectSchema = z.object({
   name:z.string().min(5).max(35),
    builder:z.boolean(),
  })