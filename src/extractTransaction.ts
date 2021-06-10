import * as express from "express";

import type { Transaction } from "@truffle/decoder";

export interface ExtractTransactionOptions {
  request: express.Request;
}

export type ExtractedTransaction = Transaction & { to: string };

export const extractTransaction = async ({
  request
}: ExtractTransactionOptions): Promise<ExtractedTransaction> => {
  // HACK add non-nullability to Transaction's `to` field; we'll only handle
  // calls to existing contracts for now
  const transaction: ExtractedTransaction = {
    // @ts-ignore cause hackathon
    from: request.query.from,
    // @ts-ignore cause hackathon
    to: request.query.to,
    // @ts-ignore cause hackathon
    input: request.query.data,
    blockNumber: null
  };

  return transaction;
};
