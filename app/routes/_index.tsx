import type { Route } from "./+types/_index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hacker News" },
    { name: "description", content: "Welcome to Hacker News" },
  ];
}

export default function Index() {
  return (
    <div className="h-screen">
      <div className="bg-[#FE7139] w-full h-1"></div>
      <img src="dark_mode_logo.svg" alt="Hacker News Logo" className="pt-[49px] pl-[90px]"></img>
      
    </div>
  );
}
