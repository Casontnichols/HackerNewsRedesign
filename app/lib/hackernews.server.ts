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
Zod is used to validate the schema coming from the api at run time. If the response does not match
the schema an error will be thrown.
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

    // Validate what the API response using Zod schema.
    const parseResult = HackerNewsStorySchema.safeParse(rawData);

    if (!parseResult.success) {
      throw parseResult.error;
    }

    const story = parseResult.data;

    /*
    Overwrite the "time" attribute with an hour conversion from the current time. The conversion multiplies
    the UNIX timestamp and 1000 to get milliseconds then subtracts from the current time. The final operation
    divides by (1000 * 60 * 60) to get hours.

    NOTE: This is probably not the most scalable option since I am overwriting the "time" attribute which could
    be used in other ways of displaying the stories. For example; if I wanted to display the stories in
    descending order by time then I would not want to overwright this value as the "time" attribute is more
    valuable than a conversion to hours.
    */
    story.time = Math.floor((Date.now() - story.time * 1000) / (1000 * 60 * 60));

    return story
  });

  // Waits for all story fetches to resolve.
  const stories = await Promise.all(storyResponses);

  return stories;
}
