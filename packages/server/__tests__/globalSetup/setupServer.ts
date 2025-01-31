import { start } from "@/app";

type TeardownFunction = () => Promise<void>;

let teardownHappened = false;

/**
 * Setup the server for testing.
 *
 * @returns {Promise<TeardownFunction>} - A function that will teardown the server
 */
export async function setup(): Promise<TeardownFunction> {
  console.log("⚡️ OPENING GASELESS SERVER \n");

  const app = await start();

  return async () => {
    if (teardownHappened) {
      throw new Error("teardown called twice");
    }
    teardownHappened = true;
    await app.dispose();
    console.log("❌ CLOSING GASELESS SERVER");
  };
}
