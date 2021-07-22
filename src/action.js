const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require("node-fetch");

const GITHUB_TOKEN = core.getInput('TOKEN_GITHUB');
const COMMENT = core.getInput('COMMENT');
const TENOR_TOKEN = core.getInput('TENOR_TOKEN');
const octokit = github.getOctokit(GITHUB_TOKEN);

const { context = {} } = github;
const { pull_request } = context.payload;

async function run() {
  let body = COMMENT;
  if (TENOR_TOKEN) {
    const giftUrl = await getGift();
    body = `${COMMENT}\n\n<img src="${giftUrl}" alt="William Gift" />`;
  }
  console.log(octokit)
  await octokit.rest.issues.createComment({
    ...context.repo,
    issue_number: pull_request.number,
    body
  });
}


async function getGift() {
  const randomPos = Math.round(Math.random() * 1000);
  const url = `https://api.tenor.com/v1/search?q=thank%20you&pos=${randomPos}&limit=1&media_filter=minimal&contentfilter=high&key=${TENOR_TOKEN}`;
  const response = await fetch(url);
  const { results } = await response.json();
  const gifUrl = results[0].media[0].tinygif.url;
  return gifUrl;
}

run();