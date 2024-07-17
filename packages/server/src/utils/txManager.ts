import { Hex } from "viem";

export function createTxManager() {
  const queue: (() => Promise<void>)[] = [];
  let processing = false;

  async function queueTx(call: () => Promise<Hex>): Promise<Hex> {
    return new Promise((resolve, reject) => {
      queue.push(async () => {
        try {
          const hash = await call();
          resolve(hash);
        } catch (error) {
          reject(error);
        }
      });

      void processQueue();
    });
  }

  async function processQueue() {
    if (processing) return;
    processing = true;

    while (queue.length > 0) {
      const tx = queue.shift();
      if (tx) {
        try {
          await tx();
        } catch (error) {
          console.error("Error processing transaction:", error);
        }
      }
    }

    processing = false;
  }

  return { queueTx };
}
