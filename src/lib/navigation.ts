export interface Navigation {
  title: string;
  href?: string;
  children?: Navigation[];
}

export const navigation: Navigation[] = [
  {
    title: 'Kom i gang',
    href: '/docs',
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
      },
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
        href: '/docs/lepton/models/intro',
        children: [
          {
            title: 'Django ORM',
            href: '/docs/lepton/models/orm',
          },
          {
            title: 'Model fields',
            href: '/docs/lepton/models/fields',
          },
          {
            title: 'Tilganskontroll',
            href: '/docs/lepton/models/access',
          },
          {
            title: 'Admin panel',
            href: '/docs/lepton/models/admin',
          },
          {
            title: 'Factory',
            href: '/docs/lepton/models/factory',
          },
          {
            title: 'Polymorfisme (Arv)',
            href: '/docs/lepton/models/polymorphic',
          },
        ],
      },
      {
        title: 'Serializer',
        href: '/docs/lepton/serializers/intro',
        children: [
          {
            title: 'Polymorfisme (Arv)',
            href: '/docs/lepton/serializers/polymorphic',
          },
        ],
      },
      {
        title: 'Viewsets',
        href: '/docs/lepton/viewsets/intro',
        children: [
          {
            title: 'Oppsett av URL',
            href: '/docs/lepton/viewsets/url',
          },
          {
            title: 'Tilganskontroll',
            href: '/docs/lepton/viewsets/access',
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
          {
            title: 'Polymorfisme (Arv)',
            href: '/docs/lepton/viewsets/polymorphic',
          },
        ],
      },
      {
        title: 'Testing',
        href: '/docs/lepton/testing/intro',
        children: [
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
        title: 'API nøkler',
        href: '/docs/lepton/apikeys/intro',
        children: [
          {
            title: 'Filopplastning',
            href: '/docs/lepton/apikeys/file',
          },
          {
            title: 'Epost',
            href: '/docs/lepton/apikeys/email',
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
        ],
      },
    ],
  },
  {
    title: 'Drift',
    children: [
      {
        title: 'Azure',
        children: [
          {
            title: '0. Azure læringsløp',
            href: '/docs/drift/azure/azure-laeringslop',
          },
          {
            title: '1. IaC & Terraform basic',
            href: '/docs/drift/azure/iac-terraform-basic',
          },
          {
            title: '2. Resources & RG',
            href: '/docs/drift/azure/resources-rg',
          },
          {
            title: '3. Azure Containers',
            href: '/docs/drift/azure/azure-containers',
          },
          {
            title: '4. Azure Cost Management',
            href: '/docs/drift/azure/azure-cost-management',
          },
          {
            title: '5. Azure VNet',
            href: '/docs/drift/azure/azure-vnet',
          },
          {
            title: '6. Azure DB',
            href: '/docs/drift/azure/azure-db',
          },
          {
            title: '7. Azure Storage Account',
            href: '/docs/drift/azure/azure-storage-account',
          },
          {
            title: '8. Terraform Intermediate',
            href: '/docs/drift/azure/terraform-intermediate',
          },
          {
            title: '9. Azure Container Registry',
            href: '/docs/drift/azure/azure-container-registry',
          },
        ],
      },
      {
        title: 'OpenStack',
        children: [
          {
            title: 'Oppsett',
            href: '/docs/drift/openstack/installation',
          },

          {
            title: 'Openstack API',
            href: '/docs/drift/openstack/api_access',
            children: [
            {
              title: 'Object store (blob storage)',
              href: '/docs/drift/openstack/api_access/object_store',
            },
            ],
          },
          {
            title: 'Virtuelle Maskiner',
            href: '/docs/drift/openstack/virtual_machines',
            children: [
              {
                title: 'Hvordan lage en VM',
                href: '/docs/drift/openstack/virtual_machines/how_to_make_vm',
              },
              {
                title: 'Drifts VM-er',
                children: [
                  {
                    title: 'Adelie (Webserver)',
                    href: '/docs/drift/openstack/virtual_machines/instances/adelie',
                  },
                  {
                    title: 'Royal (Vaultwarden)',
                    href: '/docs/drift/openstack/virtual_machines/instances/royal',
                  },
                  {
                    title: 'Fiordland (DB)',
                    href: '/docs/drift/openstack/virtual_machines/instances/fiordland',
                  },
                  {
                    title: 'King (Backend API)',
                    href: '/docs/drift/openstack/virtual_machines/instances/king',
                  },
                  {
                    title: 'Macaroni (Minecraft)',
                    href: '/docs/drift/openstack/virtual_machines/instances/macaroni',
                  },
                  {
                    title: 'Chinstrap (Proxy)',
                    href: '/docs/drift/nettverk/proxy',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: 'Databaser',
        children: [
          {
            title: 'Hvordan lage en database',
            href: '/docs/drift/databaser/create_database',
          },
          {
            title: 'Drift sitt databaseoppsett',
            href: '/docs/drift/databaser/databaser_i_drift',
          },
        ],
      },
      {
        title: "How-to's",
        children: [
          {
            title: 'Deploy prosjekt på Adelie',
            href: '/docs/drift/how_to/deploy_adelie',
          },
        ],
      },
      {
        title: 'Network',
        href: '/docs/drift/nettverk',
        children: [
          {
            title: 'Drifts proxy oppsett',
            href: '/docs/drift/nettverk/proxy',
          },
        ],
      },
      {
        title: 'Linux',
        href: '/docs/drift/linux',
        children: [
          {
            title: 'Brukere i Linux',
            href: '/docs/drift/linux/users',
          },
        ],
      },
      {
        title: 'Ressurser',
        href: '/docs/drift/resources',
      },
      {
        title: 'Utfordringer',
        href: '/docs/drift/challenges',
        children: [
          {
            title: 'Template',
            href: '/docs/drift/challenges/template',
          },
          {
            title: 'Linux',
            children: [
              {
                title: 'Linux Lift-Off (#1)',
                href: '/docs/drift/challenges/linux/intro',
              },
              {
                title: 'Mastering the Essentials (#2)',
                href: '/docs/drift/challenges/linux/essentials',
              },
              {
                title: 'Scripting and Automation (#3)',
                href: '/docs/drift/challenges/linux/script',
              },
            ],
          },
          {
            title: 'Git',
            children: [
              {
                title: 'Git on up (#1)',
                href: '/docs/drift/challenges/git/intro',
              },
            ],
          },
          {
            title: 'Databaser',
            children: [
              {
                title: 'DB noob in Drift (#1)',
                href: '/docs/drift/challenges/db/noob',
              },
              {
                title: 'Building a Data-Driven World (#2)',
                href: '/docs/drift/challenges/db/sql',
              },
              {
                title: 'Pythonic Data Mastery (#3)',
                href: '/docs/drift/challenges/db/alchemy',
              },
            ],
          },
          {
            title: 'Web',
            children: [
              {
                title: 'Personal Profile Page (#1)',
                href: '/docs/drift/challenges/web/profile',
              },
              {
                title: 'Interactive Forms (#2)',
                href: '/docs/drift/challenges/web/contact',
              },
              {
                title: 'What Next? (#3)',
                href: '/docs/drift/challenges/web/next/intro',
              },
            ],
          },
          {
            title: 'Api',
            children: [
              {
                title: 'Introdction to Node (#1)',
                href: '/docs/drift/challenges/api/node',
              },
            ],
          },
          {
            title: "Let's HTTP-arty (#1)",
            href: '/docs/drift/challenges/http',
          },
          {
            title: 'Coolify (#2)',
            href: '/docs/drift/challenges/coolify',
          },
          {
            title: 'Cron-quer the Clock (#3)',
            href: '/docs/drift/challenges/cronjob',
          },
          {
            title: 'Harmony and Discord (#5)',
            href: '/docs/drift/challenges/discord',
          },
          {
            title: 'Docker, I hardly know her (#6)',
            href: '/docs/drift/challenges/docker',
          },
          {
            title: 'System of a D(aemon) (#8)',
            href: '/docs/drift/challenges/services',
          },
          {
            title: 'To Sudo or Not To Sudo / Shell Yeah! (#9)',
            href: '/docs/drift/challenges/terminal',
          },
          {
            title: 'Nginx-pect the Unexpected (#10)',
            href: '/docs/drift/challenges/nginx',
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
      {
        title: 'Minecraft-server',
        href: '/docs/projects/minecraft-server',
      },
    ],
  },
];
