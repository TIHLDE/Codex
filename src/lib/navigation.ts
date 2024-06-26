export interface Navigation {
  title: string;
  href?: string;
  children?: Navigation[];
}

export const navigation: Navigation[] = [
  {
    title: 'Kom i gang',
    href: '/',
  },
  {
    title: 'Lepton',
    href: '/docs/lepton',
    children: [
      {
        title: 'Introduksjon',
        href: '/docs/lepton/introduction',
      },
      {
        title: 'Installasjon',
        href: '/docs/lepton/installation',
      },
      {
        title: 'Et lite eksempel',
        href: '/docs/lepton/example',
      },
      {
        title: 'How-to',
        children: [
          {
            title: 'Modeller og tabeller i databasen',
            href: '/docs/lepton/howto/models',
          },
          {
            title: 'Serializere og JSON',
            href: '/docs/lepton/howto/serializers',
          },
          {
            title: 'Viewsets og respons',
            href: '/docs/lepton/howto/viewsets',
          },
        ],
      },
      {
        title: 'Hvordan håndtere filopplastning',
        href: '/docs/lepton/extensions/fileUpload',
      },
    ],
  },
  {
    title: 'Kvark',
    href: '/docs/kvark',
    children: [
      {
        title: 'Introduksjon',
        href: '/docs/kvark/introduction',
      },
      {
        title: 'Installasjon',
        href: '/docs/kvark/installation',
      },
      {
        title: 'Innføringer',
        href: '/docs/kvark/examples',
        children: [
          {
            title: 'Innføring i React',
            href: '/docs/kvark/examples/react',
          },
          {
            title: 'Innføring i Typescript',
            href: '/docs/kvark/examples/typescript',
          },
          {
            title: 'Innføring i Tailwind',
            href: '/docs/kvark/examples/tailwind',
          },
          {
            title: 'Innføring i shad/cn',
            href: '/docs/kvark/examples/shadcn',
          },
        ],
      },
      {
        title: 'How-to',
        href: '/docs/kvark/how-to',
        children: [
          {
            title: 'API-kall',
            href: '/docs/kvark/how-to/api-call',
            children: [
              {
                title: 'Lage en API-funksjon',
                href: '/docs/kvark/how-to/api-call/create',
              },
              {
                title: 'Bruke en API-funksjon',
                href: '/docs/kvark/how-to/api-call/use',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Prosjekter',
    href: '/docs/projects',
    children: [
      {
        title: 'Lepton',
        href: '/docs/projects/lepton',
      },
      {
        title: 'Kvark',
        href: '/docs/projects/kvark',
      },
      {
        title: 'Kontres',
        href: '/docs/projects/kontres',
      },
      {
        title: 'Blitzed',
        href: '/docs/projects/blitzed',
      },
      {
        title: 'Codex',
        href: '/docs/projects/codex',
      },
      {
        title: 'Fondet',
        href: '/docs/projects/fondet',
      },
      {
        title: 'Jubileum',
        href: '/docs/projects/jubileum',
      },
      {
        title: 'Shorty',
        href: '/docs/projects/shorty',
      },
      {
        title: 'ScriptStack',
        href: '/docs/projects/scriptstack',
      },
    ],
  },
];
