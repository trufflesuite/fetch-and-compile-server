import * as express from "express";

import TruffleConfig from "@truffle/config";
import { forAddress, ProjectInfo, Transaction } from "@truffle/decoder";

import { getProjectInfoForTransaction } from "./getProjectInfoForTransaction";
import { serializeCalldataDecoding } from "./serializeCalldataDecoding";
import { extractTransaction } from "./extractTransaction";
import { prepareConfig } from "./prepareConfig";

export const handleTransaction = async (
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

    const decoding = await decoder.decodeTransaction(transaction);

    response.status(200).json(serializeCalldataDecoding(decoding));
  } catch (err) {
    response.status(500).json(err.message);
  }
};
