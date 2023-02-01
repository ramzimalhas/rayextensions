import { useState } from "react";
import { popToRoot, Clipboard, showHUD } from "@raycast/api";
import { runAppleScript } from "run-applescript";
import checkBikeInstalled from "./index";

export default function main() {
  const [ranScript, setRanScript] = useState<boolean>(false);

  const error_alert = checkBikeInstalled();
  if (error_alert) {
    return error_alert;
  } else if (!ranScript) {
    setRanScript(true);

    // Get lines of text from the clipboard
    Clipboard.readText().then((text) => {
      const lines = text?.split("\n");
      const clipboard_lines = lines?.map(
        (line: string) => '"' + line.replaceAll("\\", "\\\\").replaceAll('"', '\\"') + '"'
      );

      // Run script
      runAppleScript(`tell application "Bike"
        activate
        -- Get the most recent document
        set theDoc to document 1

        -- Get lines of clipboard content
        set docData to {${clipboard_lines}}

        -- Add the clipboard content to the end of the document
        repeat with lineItem in docData
          tell theDoc to make new row with properties {name: lineItem}
        end repeat
      end tell`).then(() => showHUD("Appended To Current Document").then(() => popToRoot()));
    });
  }
}
