## Why Use Tauri?

Tauri provides a way to create highly secure, lightweight, and cross-platform desktop applications using web technologies. The benefit of using Tauri is that you can leverage the web development skillset to create applications that have native capabilities. Tauri applications use a fraction of memory and disk space compared to traditional Electron-based apps, providing a more efficient solution for desktop applications. Additionally, Tauri offers robust security features, making your applications safer and more resilient.

## Why Next.js with Tauri?

Next.js is a leading React framework that offers functionalities like server-side rendering and static site generation, and it's known for its performance and developer-friendly experience. When combined with Tauri, you get the best of both worlds: the advanced capabilities of a React framework for building complex front-ends, coupled with the lightweight, native performance and security benefits that Tauri offers for desktop applications.

Find the full code for this article on [GitHub](https://github.com/owolfdev/tauri-open-local-files-and-urls).

## Prerequisites:

- Basic understanding of Next.js
- Node.js and npm installed

For setting up a Next.js project with Tauri, please follow the [Tauri Quickstart Guide for Next.js](https://tauri.app/v1/guides/getting-started/setup/next-js). Once you've followed the steps, you should have a working Next.js project inside a Tauri application. Now follow the steps below to add the functionality to open files and URLs from your desktop app.

### Step 1: Add Tauri API to Next.js Project

First, add the Tauri API package to your Next.js project using npm.

```bash
npm install @tauri-apps/api
```

### Step 2: Implement Rust Functionality (main.rs)

Before we dive into the Next.js code, let's create the Rust functions that will be invoked by our Next.js application. In the `src-tauri/src/main.rs` file, add the following code.

```rust
// main.rs

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::Manager;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![open_file, open_url])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn open_file(file_path: String) -> Result<(), String> {
  #[cfg(target_os = "linux")]
  let opener = "xdg-open";

  #[cfg(target_os = "macos")]
  let opener = "open";

  #[cfg(target_os = "windows")]
  let opener = "cmd /c start";

  std::process::Command::new(opener)
    .arg(file_path)
    .spawn()
    .map_err(|err| format!("Failed to open file: {}", err))?;

  Ok(())
}

#[tauri::command]
fn open_url(url: String) -> Result<(), String> {
  #[cfg(target_os = "linux")]
  let opener = "xdg-open";

  #[cfg(target_os = "macos")]
  let opener = "open";

  #[cfg(target_os = "windows")]
  let opener = "start";

  std::process::Command::new(opener)
    .arg(url)
    .spawn()
    .map_err(|err| format!("Failed to open URL: {}", err))?;

  Ok(())
}
```

#### Explanation:

- `tauri::generate_handler![open_file, open_url]`: This line specifies which Rust functions should be exposed to the web application.
- `#[tauri::command]`: The attribute marks the function as a Tauri command that can be invoked from the front-end.

- `std::process::Command`: We use Rust's standard library to execute shell commands to open files and URLs.

### Step 3: Implement Functionality in Next.js (page.tsx)

Now that our backend functionality is ready, let's go ahead and write the front-end code that will interact with it. Open your `pages/index.tsx` or create a new component and add the following code.

```tsx
// page.tsx

import { invoke } from "@tauri-apps/api/tauri";

const PATH_TO_FILE = "/path/to/file";

export default function Home() {
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
      <button onClick={() => openFile(PATH_TO_FILE)}>Open File</button>
      <button onClick={() => openUrl("https://www.google.com")}>
        Open Google
      </button>
    </div>
  );
}
```

#### Explanation:

- `invoke("open_file", { filePath: filePath })`: This line uses Tauri's `invoke` function to call the `open_file` command that we defined in `main.rs`. The `filePath` is passed as an argument.

- Similarly, `invoke("open_url", { url: url })` calls the `open_url` command to open a URL.

The `openFile` and `openUrl` commands open local files and URLs using the default application on your system. For example, on macOS, the `open` command will be called to open the file or URL using the default application associated with the file type or URL scheme (see the code in step 2). On Windows, the `start` command will be called to open the file or URL using the default application associated with the file type or URL scheme.

### Step 4: Run the Application

To run your Next.js + Tauri application, you can use:

```bash
npm run tauri dev
```

## Conclusion

If everything went smoothly, your application should open a Tauri window with buttons for opening a file and a URL. When you click these buttons, the corresponding Rust functions will be triggered, demonstrating how Tauri allows front-end and back-end languages to communicate seamlessly.

By following this article, you've learned how to leverage Tauri's native capabilities inside a Next.js application, allowing you to open files and URLs in a cross-platform way. This serves as a powerful example of how web technologies can interact with native functionalities through Tauri.
