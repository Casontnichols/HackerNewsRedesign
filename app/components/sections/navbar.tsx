import { ArticleFilter } from "../common/article-filter";
import { ModeToggle } from "../mode-toggle";
import { useTheme } from "../theme-provider";

export function Navbar({
  filter,
  setFilter,
}: {
  filter: "latest" | "starred";
  setFilter: (value: "latest" | "starred") => void;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col">
      <div className="bg-[#FE7139] w-full h-1"></div>
      <div className="flex justify-between">
        <div className="flex gap-10">
          <img
            src={isDark ? "/dark_mode_logo.svg" : "/light_mode_logo.svg"}
            alt="Hacker News Logo"
            className="pt-12.25 pl-22.5"
          />
          <div className="pt-13.5">
            <ArticleFilter value={filter} onChange={setFilter} />
          </div>
        </div>
        <div className="pt-13.5 pr-20">
          <ModeToggle></ModeToggle>
        </div>
      </div>
    </div>
  );
}
