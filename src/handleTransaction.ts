import * as express from "express";

import TruffleConfig from "@truffle/config";
import { forAddress, ProjectInfo, Transaction } from "@truffle/decoder";

import { getProjectInfoForTransaction } from "./getProjectInfoForTransaction";
import { serializeCalldataDecoding } from "./serializeCalldataDecoding";

export const handleTransaction = async (
  request: express.Request,
  response: express.Response
): Promise<void> => {
  // HACK add non-nullability to Transaction's `to` field; we'll only handle
  // calls to existing contracts for now
  const transaction: Transaction & { to: string } = {
    // @ts-ignore cause hackathon
    from: request.query.from,
    // @ts-ignore cause hackathon
    to: request.query.to,
    // @ts-ignore cause hackathon
    input: request.query.data,
    blockNumber: null
  };

  const config = TruffleConfig.default().merge({
    networks: {
      mainnet: {
        url: process.env["MAINNET_URL"],
        network_id: 1
      }
    },
    compilers: {
      solc: {
        docker: true
      }
    },
    network: "mainnet",
    // May need to make a more proper truffle config, will see. TODO
    sourceFetchers: ["etherscan"],
    etherscan: {
      apiKey: process.env["ETHERSCAN_KEY"]
    }
  });

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
