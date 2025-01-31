import { hexToResource } from "@latticexyz/common";
import { Account, Address, Chain, Hex, toHex, Transport, WalletClient } from "viem";
import { signTypedData } from "viem/actions";

import { CHAIN_ID } from "@tests/lib/constants";

type SignCallOptions = {
  userClient: WalletClient<Transport, Chain, Account>;
  worldAddress: Address;
  systemId: Hex;
  callData: Hex;
  nonce?: bigint;
};

export async function signCall({ userClient, worldAddress, systemId, callData, nonce = 0n }: SignCallOptions) {
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
