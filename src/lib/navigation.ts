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
    title: 'Nytt medlem?',
    children: [
      {
        title: 'Første steg',
        href: '/docs/new_member/first_steps',
      },
      {
        title: 'WSL',
        href: '/docs/new_member/wsl',
      }
    ],
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
        title: 'Models',
        children: [
          {
            title: 'Intro',
            href: '/docs/lepton/models/intro',
          },
          {
            title: 'Django ORM',
            href: '/docs/lepton/models/orm',
          },
          {
            title: 'Model fields',
            href: '/docs/lepton/models/fields',
          },
          {
            title: 'Admin panel',
            href: '/docs/lepton/models/admin',
          },
          {
            title: 'Factory',
            href: '/docs/lepton/models/factory',
          },
        ],
      },
      {
        title: 'Serializer',
        children: [
          {
            title: 'Intro',
            href: '/docs/lepton/serializers/intro',
          },
        ],
      },
      {
        title: 'Viewsets',
        children: [
          {
            title: 'Intro',
            href: '/docs/lepton/viewsets/intro',
          },
          {
            title: 'Oppsett av URL',
            href: '/docs/lepton/viewsets/url',
          },
          {
            title: 'Viewsets, filtrering og søk',
            href: '/docs/lepton/viewsets/filtering',
          },
          {
            title: 'Viewsets og paginering',
            href: '/docs/lepton/viewsets/pagination',
          },
          {
            title: 'Tilpassete endepunkter',
            href: '/docs/lepton/viewsets/custom_endpoints',
          },
          {
            title: 'Feilhåndtering for endepunkter',
            href: '/docs/lepton/viewsets/exceptions',
          },
        ],
      },
      {
        title: 'Testing',
        children: [
          {
            title: 'Intro',
            href: '/docs/lepton/testing/intro',
          },
          {
            title: 'Pytest',
            href: '/docs/lepton/testing/pytest',
          },
          {
            title: 'Enhetstester',
            href: '/docs/lepton/testing/unit',
          },
          {
            title: 'Integrasjonstester',
            href: '/docs/lepton/testing/integration',
          },
          {
            title: 'Test-driven development',
            href: '/docs/lepton/testing/tdd',
          },
        ],
      },
      {
        title: 'How-to',
        children: [
          {
            title: 'Hvordan bruke tasks med Celery',
            href: '/docs/lepton/howto/celery',
          },
          {
            title: 'Hvordan håndtere filopplastning',
            href: '/docs/lepton/howto/fileUpload',
          },
          {
            title: 'Hvordan håndtere rettigheter',
            href: '/docs/lepton/howto/permissions',
          },
        ],
      },
      {
        title: 'Konfig',
        children: [
          {
            title: 'Makefile',
            href: '/docs/lepton/config/makefile',
          },
        ],
      },
      {
        title: 'Hvordan håndtere filopplastning',
        href: '/docs/lepton/extensions/fileUpload',
      },
      {
        title: 'Bruk av eksternt API',
        children: [
          {
            title: 'Verifisering med Feide',
            href: '/docs/lepton/external_api/feide',
          },
        ],
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
                title: 'Lage en API-funksjon (GET/POST)',
                href: '/docs/kvark/how-to/api-call/create',
              },
              {
                title: 'Bruke en API-funksjon (GET)',
                href: '/docs/kvark/how-to/api-call/use-query',
              },
              {
                title: 'Bruke en API-funksjon (POST/PUT/PATCH/DELETE)',
                href: '/docs/kvark/how-to/api-call/use-mutation',
              },
              {
                title: 'Caching av API-kall',
                href: '/docs/kvark/how-to/api-call/caching',
              },
            ],
          },
          {
            title: 'Autentisering',
            href: '/docs/kvark/how-to/authentication',
          },
          {
            title: 'Lage en ny side',
            href: '/docs/kvark/how-to/create-page',
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
