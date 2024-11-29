/*eslint-disable*/
import Button from "@atlaskit/button/new";
import { Box, Inline, xcss } from "@atlaskit/primitives";
import Select from "@atlaskit/select";
import { invoke } from "@forge/bridge";
import React, { useEffect, useState } from "react";

export default function LinkModal(props) {
  // Fetch link options
  // API to link issue
  const [issueLinkTypes, setIssueLinkTypes] = useState([]);

  useEffect(() => {
    (async () => {
      console.log("ISSUE KEY", props.outwardIssueKey)
      const { issueLinkTypes }: any = await invoke("getIssueLinkTypes");
      setIssueLinkTypes(issueLinkTypes);
    })();
  }, []);

  return (
    <Box
    padding="space.100" 
    xcss={xcss({

    })}>
      <Inline alignInline="start">
      {props.inwardIssueKey}
      <Select
        inputId="link-select"
        // eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
        // className="link-select"
        // classNamePrefix="react-select"
        options={Array.from(
          new Set(
            issueLinkTypes.flatMap((link) => [
              { label: link.inward, value: link.inward },
              { label: link.outward, value: link.outward },
            ])
          )
        )}

        // placeholder="Choose a city"
      />
      {props.outwardIssueKey}
      </Inline>
      <br/ >
      <Inline alignBlock="end">
      <Button onClick={() => {}}>Cancel</Button>
      <Button appearance="primary" onClick={() => {}}>Confirm</Button>
      </Inline>
    </Box>
  );
}
