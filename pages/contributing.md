---
title: Contributing
description: How to contribute
---

{% callout type="info" title="Please read this page before contributing to the project" %}
Some syntax and formatting rules are enforced by the formatting engine and project setup.
{% /callout %}

## Introduction

This project is built using [Nextjs](https://nextjs.org/), a React server-side framework and 
[Markdoc](https://markdoc.dev/), a markdown documentation templating engine.
The project is hosted on [Vercel](https://vercel.com/), the creators of Nextjs.

The reason for using Markdoc is to be able to write documentation in markdown and have it 
rendered as a static site, while also being able to use React components in the markdown files. 
This allows us to write docs quickly, customize the site, and preview components and embedded links.

Other than that, all markdown files follow regular Markdown syntax. Please refer to the 
[Markdoc documentation](https://markdoc.dev/docs) for more information.

## Project structure

If you only plan on writing documentation, you can open the pages folder at the root level and 
start writing markdown `(.md)` files. Make sure you link the files in the sidebar by adding them to the `constants/navItems.ts` file.

If you plan on contributing to the project, you should read the following sections.

### Pages
This is where the documentation is written. The pages are written in markdown and are rendered 
as static pages. The only exception is the `_app.tsx` file, which parses the markdown files and 
generates the website pages.

**Example:**

In `/pages` folder:
```yaml
api
  - index.md # this is the api page
  - users
    - index.md # this is the users page
    - get_by_id.md
    - create.md
```

In `/constants/navItems.ts` file:
```typescript
export const navItems = [
  {
    title: "API", // The title field is used to generate the sidebar, and can be anything
    href: "/api",
    children: [
      {
        title: "Users",
        href: "/api/users",
        children: [
          {
            title: "Get by ID",
            href: "/api/users/get_by_id"
          },
          {
            title: "Create",
            href: "/api/users/create"
          }
        ]
      }
    ]
  }
]
```



### Components
These are the React components used in the markdown files. These are used both as website 
components, and certain markdown components. For example, the `callout` component can be used in 
markdown, and is later transpiled to html through the respective component. These are refered to 
as tags by the Markdoc engine.

There are a few steps to create such a component, please refer to the [Markdoc documentation](https://markdoc.dev/docs/tags) for more information.

### Markdoc
Files related to Markdoc, such as partial pages (injecting content into a page), and 
declarations for custom tags and nodes. A node converts markdown to markdown, while a tag 
creates a React component from markdown.

The `markdoc/partials/api_base` file is used to render the top section of the API pages, which 
allows for some nice refactoring. This partial uses the `markdoc/tags/api_props` tag to render the 
content, which is generated from the metadata at the top of all API pages.

### Public
Static files, such as icons, images, and stylesheets are stored here. These are only used by 
Nextjs to render components.

## Markdown page
Each markdown file has a metadata section at the top, which is used to generate the page. This 
part is written in YAML, and is parsed by the Markdoc engine. Always use the `title` and 
`description` fields, as these are used to create the page title and meta description.

*For example, the following metadata is used to generate this page:*

```yaml
---
title: Contributing
description: How to contribute
---
```

**Available props:**
```yaml
---
title: string
description: string
version: string
# For API pages (fields will not be shown without api_base partial)
method: string
url: string
response_codes: string[]
requires_auth: boolean # optional
permissions: string[] # optional
---
```

### Api page
The API pages have a few extra fields in the metadata section, which are used to generate the 
endpoint's information bit. Following are the fields used in the metadata section:

```yaml
---
title: "Endpoint title"
description: "Does some fancy magic using Rust macros"
method: METHOD
url: v1/your/endpoint
response_codes:
  - "201 Created"
  - "401 Unauthorized"
  - "599 Another code"
requires_auth: true # not required
permissions: # also not required
  - "permission1"
  - "permission2"
---
```
You can omit the `permission` field, but keep the `requires_auth` field if the endpoint requires 
the user to be authenticated, but not have any special scopes.

Response code colors are automatically generated based on the response code, and are as follows:

```javascript
if (code.startsWith("2")) {
  return "green"
} else {
  return "red"
} 
```
*(idk if it's worth making it more sophisticated...)*

### Api partial

The API partial is used to generate the top section of the API pages. It uses the metadata from 
the frontmatter to generate the information bit. The partial is located in `markdoc/partials/api_base`.

To use this partial, you need to add the following to the top of your markdown file:
Note that the `file` path is absolute and does not need to be changed.

```markdown
(% partial file="api_base.md" / %)
# replace parentheses with curly braces
(I can't write it here because it will be rendered)
```

Well, that's all for ya! Happy coding!
