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
