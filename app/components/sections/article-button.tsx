import { Button } from "../ui/button";

type ArtileButtonProps = {
    loadMore: () => void;
};

export function ArticleButton({ loadMore }: ArtileButtonProps) {
  return (
    <div className="flex pl-30 py-2">
      <Button
        onClick={loadMore}
        className="rounded-none bg-[#FE7139] text-white p-4"
      >
        show more
      </Button>
    </div>
  );
}
