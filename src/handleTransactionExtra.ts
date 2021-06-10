import * as express from "express";

import * as Codec from "@truffle/codec";
import { forAddress, ProjectInfo } from "@truffle/decoder";

import { gatherDefinitions } from "./gatherDefinitions";
import { getProjectInfoForTransaction } from "./getProjectInfoForTransaction";
import { extractTransaction } from "./extractTransaction";
import { prepareConfig } from "./prepareConfig";
import { serializeCalldataDecoding } from "./serializeCalldataDecoding";

export const handleTransactionExtra = async (
  request: express.Request,
  response: express.Response
): Promise<void> => {
  const transaction = await extractTransaction({ request });
  const config = await prepareConfig();

  try {
    const projectInfo: ProjectInfo = await getProjectInfoForTransaction({
      to: transaction.to,
      networkId: "1",
      config
    });

    const decoder = await forAddress(
      transaction.to,
      config.provider,
      projectInfo
    );

    // @ts-ignore HACK to grab private
    const { referenceDeclarations } = decoder.wireDecoder;

    // @ts-ignore HACK compilations is typed optional, but for us guaranteed
    const {
      compilations
    }: {
      compilations: Codec.Compilations.Compilation[];
    } = projectInfo;

    const definitions = await gatherDefinitions({
      compilations,
      referenceDeclarations
    });

    const decoding = serializeCalldataDecoding(
      await decoder.decodeTransaction(transaction)
    );

    response.status(200).json({
      decoding,
      definitions
    });
  } catch (err) {
    response.status(400).json(err.message);
  }
};
