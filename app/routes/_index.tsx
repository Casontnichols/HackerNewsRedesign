import type { Route } from "./+types/_index";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hacker News" },
    { name: "description", content: "Welcome to Hacker News" },
  ];
}

export default function index() {

}