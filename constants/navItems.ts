import { NavItemData } from "../components";

export const navItems: NavItemData[] = [
  {
    title: "Contributing",
    href: "/contributing",
  },
  {
    title: "Frontend",
    href: "/website",
    children: [
      {
        title: "Components",
        href: "/website/components",
      },
      {
        title: "Style guide",
        href: "/website/style_guide",
      },
    ],
  },
  {
    title: "Backend",
    href: "/backend",
    children: [
      {
        title: "Server",
        href: "/backend/server",
      },
      {
        title: "Database",
        href: "/backend/database",
      },
      {
        title: "API Reference",
        href: "/backend/api",
        children: [
          {
            title: "Users",
            href: "/backend/api/users",
            children: [
              {
                title: "Get by id",
                href: "/backend/api/users/get_user_by_id",
              },
              {
                title: "Get current",
                href: "/backend/api/users/get_current_user",
              },
              {
                title: "Create",
                href: "/backend/api/users/create_user",
              },
            ],
          },
        ],
      },
    ],
  },
];
