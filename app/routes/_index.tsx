import type { Route } from "./+types/_index";

import { Navbar } from "~/components/sections/navbar";
import { Footer } from "~/components/sections/footer";
import { ArticleButton } from "~/components/sections/article-button";
import { ArticleList } from "~/components/sections/article-list";

import { getStories, getTopStoryIds } from "~/lib/hackernews.server";
import { type Filter } from "~/types/article-filter-types";

import { useEffect, useRef, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hacker News" },
    { name: "description", content: "Welcome to Hacker News" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const ids = await getTopStoryIds();

  const stories = await getStories(ids);

  return { stories };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { stories } = loaderData;

  // Number of visible stories. Default page load only shows twelve stories.
  const [visibleStories, setVisibleStories] = useState(12);

  // Ref to the div used for infinite scrolling.
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Determines to show the "show more" button.
  const [showButton, setShowButton] = useState(true);

  // Function to load twelve more stories.
  const loadMoreStories = () => {
    setVisibleStories((vis) => vis + 12);
  };

  // Handles the "show more" button click and hides the button after loading additional stories.
  const handleLoadMoreButton = () => {
    loadMoreStories();
    setShowButton(false);
  };

  // Current filter determining what story list to show the user.
  const [filter, setFilter] = useState<Filter>("latest");

  // Tracking the state of starred articles using localStorage for persistence.
  const [starred, setStarred] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("starred");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  /* 
  Toggles the starred state of a story. Updates the state and persists the state change in localStorage.
  */
  const toggleStarred = (id: number) => {
    setStarred((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];

      localStorage.setItem("starred", JSON.stringify(updated));
      return updated;
    });
  };

  // Filter the stories based on the selected toggle "latest" or "starred". Default filter is set to "latest".
  const filteredStories =
    filter === "latest"
      ? stories
      : stories.filter((story) => starred.includes(story.id));

  const displayedStories = filteredStories.slice(0, visibleStories);
  /*
  Ref to skip the initial page load to skip the infinite scroll functionality. I want to skip the infinite
  scroll on the initial page load to give the user the opportunity to view the top twelve articles and
  interact with the "show more" button before hitting the infinite scroll logic. I feel this makes for a 
  better user experience.
  */
  const initialPageLoad = useRef(true);

  /*
  This observer handles the infinite scroll functionality. It watches the loadMoreRef div and will load
  more stories when the div enters the viewport.
  */
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
      {/* 
      Hide button if moved into infinite scroll 
      functionality and if user has reached the end of loaded stories 
      */}
      {filter === "latest" &&
        showButton &&
        visibleStories < filteredStories.length && (
          <ArticleButton loadMore={handleLoadMoreButton} />
        )}
      <div ref={loadMoreRef} className="h-10" />
      <Footer filter={filter} setFilter={setFilter} />
    </main>
  );
}
