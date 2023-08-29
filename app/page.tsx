"use client";

import { invoke } from "@tauri-apps/api/tauri";

const PATH_TO_FILE = "/Users/wolf/Downloads/big-brain.jpg";

export default function Home() {
  //tauri open file
  function openFile(filePath: string) {
    invoke("open_file", { filePath: filePath })
      .then(() => console.log("File opened successfully"))
      .catch((e) => console.error(`Failed to open file: ${e}`));
  }

  function openUrl(url: string) {
    invoke("open_url", { url: url })
      .then(() => console.log("URL opened successfully"))
      .catch((e) => console.error(`Failed to open URL: ${e}`));
  }

  return (
    <div>
      <div>
        <div className="text-xl">Tauri Link and Files</div>
        <div>
          <button onClick={() => openFile(PATH_TO_FILE)}>Open File</button>
        </div>
        <div>
          <button onClick={() => openUrl("https://www.google.com")}>
            Open Google
          </button>
        </div>
      </div>
    </div>
  );
}
