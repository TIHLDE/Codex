import withMarkdoc from '@markdoc/next.js';
import withSearch from './src/markdoc/search.mjs';
import withGitReflection from './src/markdoc/with-git-reflection.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'ts', 'tsx'],
};

export default withGitReflection(
  withSearch(withMarkdoc({ schemaPath: './src/markdoc' })(nextConfig)),
);
