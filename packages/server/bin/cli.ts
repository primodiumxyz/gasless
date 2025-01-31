"use strict";

import { start } from "@/app";

// Start the server and track the dispose function in SIGINT and SIGTERM
const { dispose } = await start();

// Handle process close events
process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  dispose()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Failed to close the server gracefully:", error);
      process.exit(1);
    });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  dispose()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Failed to close the server gracefully:", error);
      process.exit(1);
    });
});
