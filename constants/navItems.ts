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
      {
        title: "Wiki",
        href: "/lepton/wiki",
        children: [
          {
            title: "Intro til REST API",
            href: "/lepton/wiki/introduction/restApi",
          },
          {
            title: "Intro til Django",
            href: "/lepton/wiki/introduction/django",
          },
          {
            title: "Models",
            href: "/lepton/wiki/core/models",
          },
          {
            title: "Serializers",
            href: "/lepton/wiki/core/serializers",
          },
          {
            title: "File upload",
            href: "/lepton/wiki/extensions/fileUpload",
          }
        ]
      }
    ],
  },
];
