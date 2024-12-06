/*eslint-disable*/
import Button from "@atlaskit/button/new";
import { Box, Inline, xcss, Text } from "@atlaskit/primitives";
import Select from "@atlaskit/select";
import { invoke, showFlag, view } from "@forge/bridge";
import React, { useEffect, useState } from "react";
import { Label } from "@atlaskit/form";
import styled from "styled-components";
import Spinner from '@atlaskit/spinner';

const Footer = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: "0",
  position: "absolute",
  bottom: "20px",
  right: "20px",
});

const Outward = styled.div({
  color: "#44546F",
  fontWeight: 700
})

export default function LinkModal(props) {
  const [issueLinkTypes, setIssueLinkTypes] = useState([]);
  const [selectedLinkType, setSelectedLinkType] = useState(null);
  const [inwardIssue, setInwardIssue] = useState(null);
  const [outwardIssue, setOutwardIssue] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isLinking, setIsLinking] = useState(false);



  useEffect(() => {
    (async () => {
      setInwardIssue(await invoke("getIssueDetails", {issueKey: props.inwardIssueKey}));
      setOutwardIssue(await invoke("getIssueDetails", {issueKey: props.outwardIssueKey}));
      const { issueLinkTypes }: any = await invoke("getIssueLinkTypes");
      setIssueLinkTypes(issueLinkTypes);
      setIsLoading(false)
    })();
  }, []);

  return isLoading ? <Spinner /> : (
    <>
    <Box padding="space.200" xcss={xcss({})}>
      <>
        <Label htmlFor="async-select-example">{props.inwardIssueKey}</Label>
        <Select
          isDisabled={isLinking}
          inputId="link-select"
          // eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
          onChange={({value}) => {
            console.log("VALUE", value);
            setSelectedLinkType(value);
          }}
          label={props.inwardIssueKey}
          options={Array.from(
            new Set(
              issueLinkTypes.flatMap((link) => [
                {
                  label: link.inward,
                  value: {
                    isInward: true,
                    name: link.name,
                  },
                },
                {
                  label: link.outward,
                  value: {
                    isInward: false,
                    name: link.name,
                  },
                },
              ])
            )
          )}
          placeholder="Select an Issue link type"
        />
        <Outward>{outwardIssue.key} {outwardIssue.fields.summary}</Outward>
      </>
      <br />
      <Footer >
        <Button
          onClick={() => {
            view.close();
          }}
        >
          Cancel
        </Button>
        <Button
          appearance="primary"
          onClick={async () => {
            setIsLinking(true)
            await invoke("createIssueLink", {
              body: {
                inwardIssue: {
                  key: selectedLinkType.isInward ? props.inwardIssueKey : props.outwardIssueKey,
                },
                outwardIssue: {
                  key: !selectedLinkType.isInward ? props.inwardIssueKey : props.outwardIssueKey,
                },
                type: {
                  name: selectedLinkType.name,
                },
              },
            });
            const flag = showFlag({
              id: "link-success-flag",
              title: `Linked ${props.outwardIssueKey } to ${props.inwardIssueKey }.`,
              type: "success",
              isAutoDismiss: true,
            });
            view.close();
          }}
          isLoading={isLinking}
        >
          Confirm
        </Button>
      </Footer>
    </Box>
    </>
  );
}
