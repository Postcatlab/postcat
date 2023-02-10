// Octokit.js

import { Octokit } from 'octokit';

// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

await octokit.request('POST /repos/Postcatlab/postcat/releases', {
  owner: 'scarqin',
  repo: 'postcat',
  tag_name: 'v11.0.0',
  target_commitish: 'build/windows',
  name: 'v11.0.0',
  body: 'Description of the release',
  draft: true,
  prerelease: false,
  generate_release_notes: false
});
