// Octokit.js

import { Octokit } from 'octokit';

// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const commonInfo = {
  owner: 'scarqin',
  repo: 'postcat'
};

const setup = async () => {
  const { data } = await octokit.request('POST /repos/Postcatlab/postcat/releases', {
    ...commonInfo,
    tag_name: 'v11.0.0',
    target_commitish: 'build/windows',
    name: 'v11.0.0',
    body: 'Description of the release',
    draft: true,
    prerelease: false,
    generate_release_notes: false
  });

  console.log('releases data', data);

  await octokit.request(`POST /repos/Postcatlab/postcat/releases/${data.id}/assets`, {
    ...commonInfo,
    release_id: data.id,
    data: '../release/Postcat-Setup-0.2.0.exe'
  });
};
// application/octet-stream
setup();
