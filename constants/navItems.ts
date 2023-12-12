import { NavItemData } from "../components";

export const navItems: NavItemData[] = [
  {
    title: "Contributing",
    href: "/contributing",
  },
  {
    title: "Lepton",
    href: "/lepton",
    children: [
      // {
      //   title: "Server",
      //   href: "/lepton/server",
      // },
      // {
      //   title: "Database",
      //   href: "/lepton/database",
      // },
      {
        title: "API Reference",
        href: "/lepton/api",
      },
    ],
  },
];
