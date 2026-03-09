import { ArticleFilter } from "../common/article-filter";

export function Footer({
  filter,
  setFilter,
}: {
  filter: "latest" | "starred";
  setFilter: (value: "latest" | "starred") => void;
}) {
  return (
    <footer className="w-full bottom-0 flex flex-col items-center">
      <div className="bg-[#FE7139] w-[95%] h-1 mb-2"></div>
      <h1 className="pt-4 font-sans font-medium">Hacker News</h1>
      <div className="pt-1">
        <ArticleFilter value={filter} onChange={setFilter} />
      </div>
    </footer>
  );
}
