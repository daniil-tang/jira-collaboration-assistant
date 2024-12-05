/*eslint-disable*/
import Button from "@atlaskit/button/new";
import { Box, Inline, xcss } from "@atlaskit/primitives";
import Select from "@atlaskit/select";
import { invoke, view } from "@forge/bridge";
import React, { useEffect, useState } from "react";
import { Label } from "@atlaskit/form";

export default function LinkModal(props) {
  const [issueLinkTypes, setIssueLinkTypes] = useState([]);
  const [selectedLinkType, setSelectedLinkType] = useState(null);

  useEffect(() => {
    (async () => {
      console.log("ISSUE KEY", props.outwardIssueKey);
      const { issueLinkTypes }: any = await invoke("getIssueLinkTypes");
      setIssueLinkTypes(issueLinkTypes);
    })();
  }, []);

  return (
    <Box padding="space.200" xcss={xcss({})}>
      <>
        <Label htmlFor="async-select-example">{props.inwardIssueKey}</Label>
        <Select
          inputId="link-select"
          // eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
          onChange={(value) => {
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
        {props.outwardIssueKey}
      </>
      <br />
      <Inline alignInline="start">
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
          }}
        >
          Confirm
        </Button>
      </Inline>
    </Box>
  );
}
