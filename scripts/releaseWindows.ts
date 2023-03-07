import { Octokit } from 'octokit';

import { readFileSync } from 'fs';

const version = process.env.npm_package_version;

// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const commonInfo = {
  owner: 'Postcatlab',
  repo: 'postcat'
};

const setup = async () => {
  const { data: releaseList } = await octokit.rest.repos.listReleases(commonInfo);

  const assetNames = [`Postcat-Setup-${version}.exe`, 'latest.yml'];

  // 获取id，upload_url，
  let targetRelease = releaseList.find(n => n.name === version)!;

  if (!targetRelease) {
    const { data } = await octokit.rest.repos.createRelease({
      ...commonInfo,
      tag_name: `v${version}`,
      name: version,
      draft: true
    });

    targetRelease = data;
  }

  const { id, upload_url, assets } = targetRelease;

  for await (const assetName of assetNames) {
    const targetAsset = assets.find(n => n.name === assetName);

    if (targetAsset) {
      await octokit.rest.repos.deleteReleaseAsset({
        ...commonInfo,
        asset_id: targetAsset.id
      });
    }

    const data = readFileSync(`./release/${assetName}`);
    let param = {
      ...commonInfo,
      release_id: id,
      name: assetName,
      data: data,
      origin: upload_url,
      headers: {
        'content-type': 'application/octet-stream'
      }
    };
    // @ts-ignore
    const res = await octokit.rest.repos.uploadReleaseAsset(param);
  }

  console.log('uploadReleaseAsset success!');
};

setup();
