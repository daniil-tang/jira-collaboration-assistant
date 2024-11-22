import React, { useEffect, useState } from 'react';
import { invoke, view } from '@forge/bridge';
import DynamicTableStateless from '@atlaskit/dynamic-table';

function App() {
  const [isFetching, setIsFetching] = useState(true)
  const [similarIssues, setSimilarIssues] = useState(null)

  useEffect(() => {
    (async () => {
      setIsFetching(true)
      const context = await view.getContext();

      const issueKey = context.extension.issue.key
      console.log("CONTEXT", context)
      const similarIssuesResult: any = await invoke('getIssueProperties', {issueKey})
      console.log("SIMILAR?", similarIssuesResult)
      setSimilarIssues(similarIssuesResult?.value)
      console.log("SIMILAR ISSUES", similarIssuesResult?.value)
      setIsFetching(false)
    })()
  }, [])

  const renderSimilarIssues = () => {
    return (
      <DynamicTableStateless
        head={{cells:[]}}
        rows={similarIssues.map(similarIssue => ({
          key: similarIssue?.key,
          cells: [
            {content: similarIssue?.issueKey},
            {content: similarIssue?.summary}
          ]
        }))}
        rowsPerPage={10}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={isFetching}
      />
    )
  }

  const renderSuggestedParticipants = () => {
    return (
      <DynamicTableStateless
        head={{cells:[]}}
        rows={similarIssues.filter(similarIssue => similarIssue.assignee).map(similarIssue => ({
          key: similarIssue?.key,
          cells: [
            {content: similarIssue?.assignee}
          ]
        }))}
        rowsPerPage={10}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={isFetching}
      />
    )
  }

  return (
    <div>
      {!isFetching ? 
        <>
        {renderSimilarIssues()}
        {renderSuggestedParticipants()}
        </>
        : 'Loading...'}
    </div>
  );
}

export default App;
