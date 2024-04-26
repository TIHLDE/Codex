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
        title: 'Basics',
        children: [
          {
            title: 'Modeller og tabeller i databasen',
            href: '/docs/lepton/basics/models',
          },
          {
            title: 'Serializere og JSON',
            href: '/docs/lepton/basics/serializers',
          },
        ],
      },
      {
        title: 'Hvordan håndtere filopplastning',
        href: '/docs/lepton/extensions/fileUpload',
      },
      { title: 'Hva er Django?', href: '/docs/lepton/introduction/django' },
      { title: 'ORM', href: '/docs/lepton/introduction/orm' },
      { title: 'Hva er REST API?', href: '/docs/lepton/introduction/restApi' },
    ],
  },
  {
    title: 'Projects',
    href: '/docs/projects',
  },
];
