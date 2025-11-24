/**
 * Runs git log commands to get file information about the given file path in the repo
 * @param {string} filePath The path of the file to get git info for
 * @returns Information about the creation and last update of the file
 */
const getFileGitInfo = async (filePath) => {
  const { exec } = await import('child_process');
  const util = await import('util');
  const execPromise = util.promisify(exec);

  // Get latest info (last updated)
  const { stdout: updatedStdout } = await execPromise(
    `git log -1 --format=%an,%aI,%s,%H -- '${filePath}'`,
  );

  const [updatedByAuthor, updatedDateIso, updatedMessage, updatedHash] =
    updatedStdout.trim().split(',');

  // Get info about file creation
  const { stdout: createdStdout } = await execPromise(
    `git log --follow --format=%an,%aI,%s,%H --date default '${filePath}' | tail -1`,
  );

  const [createdByAuthor, createdDateIso, createdMessage, createdHash] =
    createdStdout.trim().split(',');

  return {
    updatedByAuthor,
    updatedDateIso,
    updatedMessage,
    updatedHash,
    createdByAuthor,
    createdDateIso,
    createdMessage,
    createdHash,
  };
};

import glob from 'fast-glob';
import * as path from 'path';
import { createLoader } from 'simple-functional-loader';
import * as url from 'url';
import Os from 'os';

const __filename = url.fileURLToPath(import.meta.url);

export default function withGitReflection(nextConfig = {}) {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      config.module.rules.push({
        test: __filename,
        use: [
          createLoader(function () {
            if (Os.platform() === 'win32') {
              return;
            }

            let pagesDir = path.resolve('./src/app');
            this.addContextDependency(pagesDir);

            let files = glob.sync('**/page.md', { cwd: pagesDir });

            let gitPromises = [];
            let nextUrls = [];

            for (let i = 0; i < files.length; i++) {
              const file = files[i];

              let url =
                file === 'page.md'
                  ? '/'
                  : `/${file.replace(/\/page\.md$/, '')}`;
              let cleanedUrl = url.replace(/\/\(private\)\/\(docs\)/, '');

              let gitInfo = getFileGitInfo('src/app/' + file);

              gitPromises.push(gitInfo);
              nextUrls.push(cleanedUrl);
            }

            return Promise.all(gitPromises).then((gitInfo) => {
              const data = nextUrls.reduce(function (map, url, i) {
                map[url] = gitInfo[i];
                return map;
              }, {});

              console.log(JSON.stringify(data));

              // When this file is imported within the application
              // the following module is loaded:
              return `
                export const gitData = ${JSON.stringify(data)};
              `;
            });
          }),
        ],
      });

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
}
