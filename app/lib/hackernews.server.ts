import {
  HackerNewsStorySchema,
  type HackerNewsStory,
} from "~/types/hackernews-types";

export async function getTopStoryIds(): Promise<number[]> {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
  );

  return response.json();
}

export async function getStories(ids: number[]): Promise<HackerNewsStory[]> {
  const storyResponses = ids.map(async (id) => {
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const rawData = await response.json();

    const parseResult = HackerNewsStorySchema.safeParse(rawData);

    if (!parseResult.success) {
      throw parseResult.error;
    }

    const story = parseResult.data;

    story.time = Math.floor((Date.now() - story.time * 1000) / (1000 * 60 * 60));

    return story
  });

  const stories = await Promise.all(storyResponses);

  return stories;
}
