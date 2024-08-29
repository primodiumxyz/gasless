import { AbiParametersToPrimitiveTypes, ExtractAbiFunction, formatAbiItem, type Abi } from "abitype";
import {
  Address,
  concatHex,
  ContractFunctionName,
  encodeAbiParameters,
  EncodeFunctionDataParameters,
  EncodeFunctionDataReturnType,
  getAbiItem,
  Hex,
  toFunctionSelector,
} from "viem";

import { Abi as BaseAbi } from "@/utils/abi";
import { fetchSystemFunctionSelector } from "@tests/lib/fetch";

export async function encodeFunctionData<
  abi extends Abi | readonly unknown[] = Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi> | undefined = undefined,
>(parameters: EncodeFunctionDataParameters<abi, functionName>): Promise<EncodeFunctionDataReturnType> {
  const { abi, args, functionName } = parameters as EncodeFunctionDataParameters;

  let abiItem = abi[0];

  if (!abiItem) throw new Error("Abi Item not found");

  if (functionName) {
    const item = getAbiItem({
      abi,
      args,
      name: functionName,
    });
    if (!item) throw new Error("Function not found");
    abiItem = item;
  }

  if (abiItem.type !== "function") throw new Error('Expected abiItem to be of type "function"');

  const definition = formatAbiItem(abiItem);
  const rawSelector = toFunctionSelector(definition);

  const selector = await fetchSystemFunctionSelector(rawSelector);

  const data = "inputs" in abiItem && abiItem.inputs ? encodeAbiParameters(abiItem.inputs, args ?? []) : undefined;
  return concatHex([selector, data ?? "0x"]);
}

/** Encode a system call to be passed as arguments into `World.call` */
export async function encodeSystemCall<
  abi extends Abi | readonly unknown[] = Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi> | undefined = undefined,
>(
  parameters: EncodeFunctionDataParameters<abi, functionName> & { readonly systemId: Hex },
): Promise<AbiParametersToPrimitiveTypes<ExtractAbiFunction<typeof BaseAbi, "call">["inputs"]>> {
  const { abi, args, functionName, systemId } = parameters as EncodeFunctionDataParameters & {
    readonly systemId: Hex;
  };

  return [
    systemId,
    await encodeFunctionData({
      abi,
      functionName,
      args,
    }),
  ];
}

/** Encode a system call to be passed as arguments into `World.callFrom` */
export async function encodeSystemCallFrom<
  abi extends Abi | readonly unknown[] = Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi> | undefined = undefined,
>(
  parameters: EncodeFunctionDataParameters<abi, functionName> & { readonly systemId: Hex; readonly from: Address },
): Promise<AbiParametersToPrimitiveTypes<ExtractAbiFunction<typeof BaseAbi, "callFrom">["inputs"]>> {
  const { abi, args, functionName, from, systemId } = parameters as EncodeFunctionDataParameters & {
    readonly systemId: Hex;
    readonly from: Address;
  };

  return [from, ...(await encodeSystemCall({ abi, args, functionName, systemId }))];
}
