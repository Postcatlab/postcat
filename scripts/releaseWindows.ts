// Octokit.js

import { Octokit } from 'octokit';

import fs from 'fs';

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

  const assetName = `Postcat-Setup-${version}.exe`;

  // 获取id，upload_url，
  let targetRelease = releaseList.find(obj => obj.name === version)!;

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

  const targetAsset = assets.find(n => n.name === assetName);

  if (targetAsset) {
    await octokit.rest.repos.deleteReleaseAsset({
      ...commonInfo,
      asset_id: targetAsset.id
    });
  }

  const data = fs.readFileSync(`./release/${assetName}`);
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

  console.log('uploadReleaseAsset success!');
};

setup();
