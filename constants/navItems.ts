import { NavItemData } from "../components";

export const navItems: NavItemData[] = [
  {
    title: "Get started",
    href: "",
  },
  {
    title: "Frontend",
    href: "/frontend",
    children: [
      {
        title: "Components",
        href: "/frontend/components",
      },
      {
        title: "Style guide",
        href: "/frontend/style_guide",
      },
    ],
  },
  {
    title: "Backend",
    href: "/backend",
    children: [
      {
        title: "Database",
        href: "/backend/database",
      },
      {
        title: "API Reference",
        href: "/backend/api",
      },
    ],
  },
];