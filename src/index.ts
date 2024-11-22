import Resolver from '@forge/resolver';
import api, { route } from "@forge/api";

const resolver = new Resolver();

resolver.define('getText', (req) => {
  console.log(req);

  return 'Hello, world!';
});

export const handler = resolver.getDefinitions();

export async function getSimilarIssues(payload) {

  const response = await api.asApp().requestJira(route`/rest/api/3/search/jql?jql=${payload.jql}&fields=summary,key,assignee`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  const issuesData =  await response.json();

  const similarIssues = issuesData.issues.map(issue => ({
    issueKey: issue.key,
    assignee: issue.fields.assignee, // assignee is null in your data, but it could be a name if not null
    summary: issue.fields.summary
  }));

  console.log("SIMILAR ISSUES", similarIssues)
  await api.asApp().requestJira(route`/rest/api/3/issue/${payload.issueKey}/properties/similar-issues`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(similarIssues)
  });
  // return similarIssues
}

export async function getIssueDetails(payload) {
  console.log("PAYLOAD", payload.issueKey)
  const response = await api.asApp().requestJira(route`/rest/api/2/issue/${payload.issueKey}`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  return await response.json();
}

resolver.define("getIssueProperties", async ({payload}) => {
  console.log("ISSUE KEY", payload.issueKey)
  const response = await api.asApp().requestJira(route`/rest/api/3/issue/${payload.issueKey}/properties/similar-issues`, {
    method: 'GET',
  });

  return await response.json();
})