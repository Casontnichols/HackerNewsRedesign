import type { Filter } from "~/types/article-filter-types";
import { Separator } from "../ui/separator";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export function ArticleFilter({
  value,
  onChange,
}: {
  value: Filter;
  onChange: (value: Filter) => void;
}) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val) => {
        if (val) onChange(val as Filter);
      }}
      className="flex items-center gap-2"
    >
      <ToggleGroupItem
        value="latest"
        className="font-sans px-0 bg-transparent border-none shadow-none hover:bg-transparent
        text-gray-500 data-[state=on]:text-[#FE7139] data-[state=on]:bg-transparent"
      >
        latest
      </ToggleGroupItem>
      <Separator orientation="vertical" className="h-4 mt-2"></Separator>
      <ToggleGroupItem
        value="starred"
        className="font-sans px-0 bg-transparent border-none shadow-none hover:bg-transparent
        text-gray-500 data-[state=on]:text-[#FE7139] data-[state=on]:bg-transparent"
      >
        starred
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
