import { z } from "zod";

export const tierSchema = z.enum(["essential", "understand", "delegatable"]);
export type Tier = z.infer<typeof tierSchema>;

export const frontmatterSchema = z.object({
  title: z.string().min(1),
  chapter: z.number().int().min(0).max(10),
  section: z.number().int().min(0).optional(),
  description: z.string().min(1),
  tier: tierSchema,
  readingTime: z.number().int().positive().optional(),
  prerequisites: z.array(z.string()).optional(),
  paths: z
    .object({
      sequential: z.number().int().positive().optional(),
      reading: z.array(z.enum(["beginner", "intermediate", "senior"])).optional(),
      practice: z
        .array(
          z.object({
            project: z.enum(["mini-bundler", "mini-framework", "mini-agent-app"]),
            context: z.string(),
          }),
        )
        .optional(),
    })
    .optional(),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;
