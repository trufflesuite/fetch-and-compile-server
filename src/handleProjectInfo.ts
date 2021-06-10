import * as express from "express";

import TruffleConfig from "@truffle/config";
import * as Codec from "@truffle/codec";
import { forAddress, ProjectInfo, Transaction } from "@truffle/decoder";

import { getProjectInfoForTransaction } from "./getProjectInfoForTransaction";
import { extractTransaction } from "./extractTransaction";
import { prepareConfig } from "./prepareConfig";

export const handleProjectInfo = async (
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

    response.status(200).json(projectInfo);
  } catch (err) {
    response.status(400).json(err.message);
  }
};
