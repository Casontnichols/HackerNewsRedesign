import { z } from "zod"

export const HackerNewsStorySchema = z.object({
    id: z.number(),
    title: z.string(),
    url: z.string().optional(),
    by: z.string(),
    score: z.number(),
    time: z.number(),
    descendants: z.number().optional(),
})

export type HackerNewsStory = z.infer<typeof HackerNewsStorySchema>;
