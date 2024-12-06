import React, { useEffect, useState } from "react";
import { invoke, view, Modal } from "@forge/bridge";
import DynamicTableStateless from "@atlaskit/dynamic-table";
import Button from "@atlaskit/button/new";
import LinkModal from "./LinkModal";

const similarIssuesTableHead = {
  cells: [
    {
      key: "key",
      content: "Issue key",
      isSortable: false,
    },
    {
      key: "summary",
      content: "Summary",
      isSortable: false,
    },
    {
      key: "actions",
      content: "Actions",
      isSortable: false,
    },
  ],
};

function App() {
  const [isFetching, setIsFetching] = useState(true);
  const [similarIssues, setSimilarIssues] = useState(null);
  const [context, setContext] = useState(null);

  useEffect(() => {
    (async () => {
      const forgeContext = await view.getContext();
      setContext(forgeContext);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setIsFetching(true);
      const context = await view.getContext();

      const issueKey = context.extension.issue.key;
      const similarIssuesResult: any = await invoke("getIssueProperties", { issueKey });
      setSimilarIssues(similarIssuesResult?.value);
      setIsFetching(false);
    })();
  }, []);

  const openLinkModal = (inwardIssueKey, outwardIssueKey) => {
    const modal = new Modal({
      onClose: (payload) => {
        console.log("onClose called with", payload);
      },
      size: "small",
      context: {
        modalKey: "link-modal",
        data: {
          inwardIssueKey,
          outwardIssueKey
        },
      },
    });

    modal.open();
  };

  const renderSimilarIssues = () => {
    return (
      <DynamicTableStateless
        head={similarIssuesTableHead}
        rows={similarIssues.map((similarIssue) => ({
          key: similarIssue?.key,
          cells: [
            { content: similarIssue?.issueKey },
            { content: similarIssue?.summary },
            { content: <Button onClick={() => openLinkModal(context.extension.issue.key, similarIssue?.issueKey)}>Link</Button> },
          ],
        }))}
        rowsPerPage={10}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={isFetching}
      />
    );
  };

  const renderSuggestedParticipants = () => {
    return (
      <DynamicTableStateless
        head={{ cells: [] }}
        rows={similarIssues
          .filter((similarIssue) => similarIssue.assignee)
          .map((similarIssue) => ({
            key: similarIssue?.key,
            cells: [{ content: similarIssue?.assignee }],
          }))}
        rowsPerPage={10}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={isFetching}
      />
    );
  };

  const renderContent = () => {
    switch (context?.extension?.modal?.modalKey) {
      case "link-modal":
        return <LinkModal inwardIssueKey={context?.extension?.modal?.data?.inwardIssueKey} outwardIssueKey={context?.extension?.modal?.data?.outwardIssueKey} />;
      default:
        return defaultContent();
    }
  };

  const defaultContent = () => (
    <div>
      {!isFetching ? (
        <>
          {renderSimilarIssues()}
          {renderSuggestedParticipants()}
        </>
      ) : (
        "Loading..."
      )}
    </div>
  );

  return <div>{renderContent()}</div>;
}

export default App;
