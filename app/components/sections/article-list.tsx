import type { HackerNewsStory } from "~/types/hackernews-types";
import { Button } from "../ui/button";
import { Star } from "lucide-react";

type ArticleListProps = {
  stories: HackerNewsStory[];
  starredStories: number[];
  onToggleStar: (id: number) => void;
};

export function ArticleList({
  stories,
  starredStories,
  onToggleStar,
}: ArticleListProps) {
  return (
    <ol className="list-decimal space-y-4 pl-30 pt-10 font-sans text-muted-foreground">
      {stories.map((story) => {
        const isStarred = starredStories.includes(story.id);

        return (
          <li key={story.id}>
            <div className="flex gap-1 text-lg">
              <a href={story.url} target="_blank" className="text-foreground">
                {story.title}
              </a>
              {story.url && (
                <p className="text-xs pt-2">
                  ({story.url?.replace(/^https?:\/\//, "")})
                </p>
              )}
            </div>
            <div className="pt-2 flex gap-1">
              <p className="text-xs">
                {story.score} points by {story.by} {story.time} hours ago |{" "}
                {story.descendants ?? 0} comments |
              </p>
              <Button
                className="px-0 bg-transparent shadow-none border-none text-muted-foreground text-xs pb-4"
                onClick={() => onToggleStar(story.id)}
              >
                <Star
                  className="w-3! h-3!"
                  fill={isStarred ? "#FE7139" : "none"}
                  color={isStarred ? "#FE7139" : "gray"}
                />
                {isStarred ? "saved" : "save"}
              </Button>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
