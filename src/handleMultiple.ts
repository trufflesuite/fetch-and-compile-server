import * as express from "express";

import { fetchAndCompileMultiple } from "@truffle/fetch-and-compile";

export const handleMultiple = async (
  request: express.Request,
  response: express.Response
): Promise<void> => {
  const addresses: string[] = typeof request.query.address === "string"
    ? [request.query.address]
    : (request.query.address as string[]);
  const networkId = parseInt(request.query["network-id"] as any || 1);
  const apiKey = process.env.ETHERSCAN_KEY;
  console.debug("addresses %o", addresses);

  try {
    const result = await fetchAndCompileMultiple(addresses, {
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
