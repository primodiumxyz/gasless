import { Hex } from "viem";

/**
 * Create a transaction manager.
 *
 * This is a simple queue that processes transactions sequentially.
 *
 * @returns An object with a `queueTx` method for adding transactions to the queue.
 */
export function createTxManager() {
  const queue: (() => Promise<void>)[] = [];
  let processing = false;

  /**
   * Add a transaction to the queue.
   *
   * @param call - The transaction to add to the queue.
   * @returns A promise that resolves to the transaction hash.
   */
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

  /**
   * Process the queue.
   *
   * This function processes the queue sequentially, ensuring that transactions are processed in order.
   */
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
