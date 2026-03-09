import type { HackerNewsStory } from "~/types/hackernews-types";
import { Button } from "../ui/button";
import { Star } from "lucide-react";
import { useState } from "react";

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

  // Tracking the state of the stories the user has clicked on and visited.
  const [visitedStories, setvisitedStories] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("visitedStories");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Pushing the id of the story that the user visits to their local storage.
  const handleStoryClick = (id: number) => {
    setvisitedStories((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      localStorage.setItem("visitedStories", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ol className="list-decimal space-y-4 pl-30 pt-10 font-sans text-muted-foreground">
      {stories.map((story) => {
        const isStarred = starredStories.includes(story.id);

        return (
          <li key={story.id}>
            <div className="flex gap-1 text-lg">
              <a
                href={story.url}
                target="_blank"
                className={`text-foreground ${visitedStories.includes(story.id) ? "opacity-60" : ""}`}
                onClick={() => handleStoryClick(story.id)}
              >
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
