import React, { useEffect, useState } from "react";
import { invoke, view, Modal, showFlag } from "@forge/bridge";
import DynamicTableStateless from "@atlaskit/dynamic-table";
import Button from "@atlaskit/button/new";
import LinkModal from "./LinkModal";
import Spinner from "@atlaskit/spinner";
import Heading from "@atlaskit/heading";

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

const suggestedParticipantsHead = {
  cells: [
    {
      key: "username",
      content: "Name",
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
  const [isAddingRequestParticipant, setIsAddingRequestParticipant] = useState(false);
  const [similarIssues, setSimilarIssues] = useState([]);
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
      setSimilarIssues(similarIssuesResult?.value?.filter((issue) => issue.issueKey != issueKey));
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
          outwardIssueKey,
        },
      },
    });

    modal.open();
  };

  const renderSimilarIssues = () => {
    return (
      <DynamicTableStateless
        head={similarIssuesTableHead}
        rows={similarIssues?.map((similarIssue) => ({
          key: similarIssue?.key,
          cells: [
            { content: similarIssue?.issueKey },
            { content: similarIssue?.summary },
            {
              content: (
                <Button onClick={() => openLinkModal(context.extension.issue.key, similarIssue?.issueKey)}>Link</Button>
              ),
            },
          ],
        }))}
        rowsPerPage={10}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={isFetching}
      />
    );
  };

  const getUniqueAssignees = () =>  [
    ...new Map(
      similarIssues
        ?.filter((similarIssue) => similarIssue.assignee) 
        .map((similarIssue) => similarIssue.assignee) 
        .map((assignee) => [assignee.accountId, assignee])
    ).values(),
  ];

  const renderSuggestedParticipants = () => {
    return (
      <DynamicTableStateless
        head={suggestedParticipantsHead}
        rows={getUniqueAssignees().map((assignee) => ({
          key: assignee.accountId,
          cells: [
            { content: assignee.displayName },
            {
              content: (
                <Button
                  isLoading={isAddingRequestParticipant}
                  onClick={async () => {
                    setIsAddingRequestParticipant(true);
                    const res = await invoke("addRequestParticipants", {
                      issueKey: context.extension.issue.key,
                      body: {
                        accountIds: [assignee.accountId],
                      },
                    });
                    setIsAddingRequestParticipant(false);
                    console.log("RES", res);
                    const flag = showFlag({
                      id: "participant-success-flag",
                      title: `Added ${assignee.displayName} as request participant.`,
                      type: "success",
                      isAutoDismiss: true,
                    });
                  }}
                >
                  Add as participant
                </Button>
              ),
            },
          ],
        }))}
        rowsPerPage={10}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={isFetching}
      />
    );
    // return (<div>Hello</div>)
  };

  const renderContent = () => {
    switch (context?.extension?.modal?.modalKey) {
      case "link-modal":
        return (
          <LinkModal
            inwardIssueKey={context?.extension?.modal?.data?.inwardIssueKey}
            outwardIssueKey={context?.extension?.modal?.data?.outwardIssueKey}
          />
        );
      default:
        return defaultContent();
    }
  };

  const defaultContent = () => (
    <div>
      {!isFetching ? (
        <>
          <Heading size="medium">Suggested Similar Issues</Heading>
          <p>
            These issues have been identified as potentially relevant to the one you're viewing. Review them to decide
            whether linking them could be beneficial.
          </p>
          {renderSimilarIssues()}
          <br />
          <Heading size="medium">Potential Collaborators</Heading>
          <p>
            These suggested participants could be valuable in helping resolve or provide context to this issue. Consider
            adding them to the issue for more input and collaboration.
          </p>
          {renderSuggestedParticipants()}
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );

  return <div>{renderContent()}</div>;
}

export default App;
