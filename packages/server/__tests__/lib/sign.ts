import { hexToResource } from "@latticexyz/common";
import { Account, Address, Chain, Hex, toHex, Transport, WalletClient } from "viem";
import { signTypedData, SignTypedDataReturnType } from "viem/actions";

import { CHAIN_ID } from "@tests/lib/constants";

/**
 * Options for signing a system call.
 *
 * @property userClient - The wallet client for the user
 * @property worldAddress - The address of the world
 * @property systemId - The ID of the system
 * @property callData - The data for the system call
 * @property nonce - The nonce for the system call
 */
type SignCallOptions = {
  userClient: WalletClient<Transport, Chain, Account>;
  worldAddress: Address;
  systemId: Hex;
  callData: Hex;
  nonce?: bigint;
};

/**
 * Sign a system call.
 *
 * @param options - The {@link SignCallOptions} for the system call
 * @returns {Promise<SignTypedDataReturnType>} - The response from the server
 */
export async function signCall({
  userClient,
  worldAddress,
  systemId,
  callData,
  nonce = 0n,
}: SignCallOptions): Promise<SignTypedDataReturnType> {
  const { namespace: systemNamespace, name: systemName } = hexToResource(systemId);

  return await signTypedData(userClient, {
    account: userClient.account,
    domain: {
      verifyingContract: worldAddress,
      salt: toHex(CHAIN_ID, { size: 32 }),
    },
    types: {
      Call: [
        { name: "signer", type: "address" },
        { name: "systemNamespace", type: "string" },
        { name: "systemName", type: "string" },
        { name: "callData", type: "bytes" },
        { name: "nonce", type: "uint256" },
      ],
    },
    primaryType: "Call",
    message: {
      signer: userClient.account.address,
      systemNamespace,
      systemName,
      callData,
      nonce,
    },
  });
}
