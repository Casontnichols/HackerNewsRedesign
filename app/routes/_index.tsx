import type { Route } from "./+types/_index";
import { Navbar } from "~/components/sections/navbar";
import { Footer } from "~/components/sections/footer";
import { ArticleList } from "~/components/sections/article-list";
import { getStories, getTopStoryIds } from "~/lib/hackernews.server";
import { useEffect, useRef, useState } from "react";
import { type Filter } from "~/types/article-filter-types";
import { ArticleButton } from "~/components/sections/article-button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hacker News" },
    { name: "description", content: "Welcome to Hacker News" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const ids = await getTopStoryIds();

  const stories = await getStories(ids);

  return {
    ids,
    stories,
  };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { stories } = loaderData;

  const [visibleStories, setVisibleStories] = useState(12);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadMoreStories = () => {
    setVisibleStories((vis) => vis + 12);
  };

  const [filter, setFilter] = useState<Filter>("latest");

  const [starred, setStarred] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("starred");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const toggleStarred = (id: number) => {
    setStarred((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];

      localStorage.setItem("starred", JSON.stringify(updated));
      return updated;
    });
  };

  const filteredStories =
    filter === "latest"
      ? stories
      : stories.filter((story) => starred.includes(story.id));

  const displayedStories = filteredStories.slice(0, visibleStories);
  const initialPageLoad = useRef(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (initialPageLoad.current) {
            initialPageLoad.current = false;
            return;
          }

          if (visibleStories < filteredStories.length) {
            loadMoreStories();
          }
        }
      },
      { rootMargin: "200px" },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [visibleStories, filteredStories.length]);

  return (
    <main className="min-h-screen">
      <Navbar filter={filter} setFilter={setFilter} />
      <ArticleList
        stories={displayedStories}
        starredStories={starred}
        onToggleStar={toggleStarred}
      />
      {filter === "latest" && <ArticleButton loadMore={loadMoreStories} />}
      <div ref={loadMoreRef} className="h-10" />
      <Footer filter={filter} setFilter={setFilter} />
    </main>
  );
}
