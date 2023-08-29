"use client";

import Link from "next/link";

import { invoke } from "@tauri-apps/api/tauri";

const PATH_TO_FILE = "/Users/wolf/Downloads/big-brain.jpg";

// Function to check if running in Tauri
const isTauri = () => {
  // Custom check to identify if you are running in Tauri
  return window.navigator.userAgent.includes("Tauri");
};

export default function Home() {
  //

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
          {isTauri() ? (
            <button onClick={() => openFile(PATH_TO_FILE)}>
              Open File from Tauri Desktop app
            </button>
          ) : (
            <Link href={PATH_TO_FILE}>Open File from web app</Link>
          )}
        </div>
        <div>
          {isTauri() ? (
            <button onClick={() => openUrl("https://www.google.com")}>
              Open Google from Tauri Desktop
            </button>
          ) : (
            <Link href="https://www.google.com">Open Google from web app</Link>
          )}
        </div>
      </div>
    </div>
  );
}
