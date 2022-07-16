// TODO: get the GitHub issues

const { Octokit } = require("@octokit/core");
const { extract } = require("article-parser");

async function getContentFromUrl(url) {
  const article = await extract(url);

  return article.content;
}

module.exports = async function () {
  const apiClient = new Octokit();

  const response = await apiClient.request(
    "GET /repos/larryhudson/11ty-reading-list/issues",
    {
      labels: "article",
      creator: "larryhudson",
    }
  );

  const issues = response.data;

  console.log(issues);

  return await Promise.all(
    issues.map(async (issue) => ({
      id: issue.id,
      title: issue.title,
      date: new Date(issue.created_at),
      content: await getContentFromUrl(issue.body),
      articleUrl: issue.body,
    }))
  );
};
