import {
  HackerNewsStorySchema,
  type HackerNewsStory,
} from "~/types/hackernews-types";

/* Function returns the top 500 ids from the hacker news api. */
export async function getTopStoryIds(): Promise<number[]> {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
  );

  return response.json();
}

/* 
Function returns a list of full story schemas from the hacker news api using the ids
from the previous function. 
Zod is used to validate the schema coming from the api at run time.
 */
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
