import { hexToResource } from "@latticexyz/common";
import { callWithSignatureTypes } from "@latticexyz/world/internal";
import { Account, Address, Chain, Hex, toHex, Transport, WalletClient } from "viem";
import { signTypedData } from "viem/actions";

import { CHAIN_ID } from "@tests/lib/constants";

type SignCallOptions = {
  userClient: WalletClient<Transport, Chain, Account>;
  worldAddress: Address;
  systemId: Hex;
  callData: Hex;
  nonce?: bigint | null;
};

export async function signCall({ userClient, worldAddress, systemId, callData, nonce: initialNonce }: SignCallOptions) {
  const nonce =
    initialNonce ??
    //TODO: implement this
    // tables.CallWithSignatureNonces.getWithKeys({ signer: userAccountClient.account.address })?.nonce ??
    0n;

  const { namespace: systemNamespace, name: systemName } = hexToResource(systemId);

  return await signTypedData(userClient, {
    account: userClient.account,
    domain: {
      verifyingContract: worldAddress,
      salt: toHex(CHAIN_ID, { size: 32 }),
    },
    types: callWithSignatureTypes,
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
