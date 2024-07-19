import { start } from "@/app";

let teardownHappened = false;

export async function setup() {
  console.log("OPENING GASELESS SERVER");

  const app = await start();

  return async () => {
    if (teardownHappened) {
      throw new Error("teardown called twice");
    }
    teardownHappened = true;
    await app.dispose();
    console.log("CLOSING GASELESS SERVER");
  };
}
