import * as express from "express";

import { fetchAndCompile } from "@truffle/fetch-and-compile";

export const handleSingle = async (
  request: express.Request,
  response: express.Response
): Promise<void> => {
  const address = request.query.address as string;
  const networkId = parseInt(request.query["network-id"] as any || 1);
  const apiKey = process.env.ETHERSCAN_KEY;

  try {
    const result = await fetchAndCompile(address, {
      network: { networkId },
      fetch: {
        fetcherOptions: {
          etherscan: {
            apiKey
          }
        }
      }
    });

    response.status(200).json(result);
  } catch (err) {
    response.status(500).json(err.message);
  }
};
