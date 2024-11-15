import Resolver from '@forge/resolver';
import api, { route } from "@forge/api";

const resolver = new Resolver();

resolver.define('getText', (req) => {
  console.log(req);

  return 'Hello, world!';
});

export const handler = resolver.getDefinitions();

export async function getSimilarIssues(payload) {

  const response = await api.asApp().requestJira(route`/rest/api/3/search/jql?jql=${payload.jql}&fields=summary,key`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  console.log(`Response: ${response.status} ${response.statusText}`);
  // const resss = await response.json;
  
  console.log(JSON.stringify(await response.json()), null, 2);
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