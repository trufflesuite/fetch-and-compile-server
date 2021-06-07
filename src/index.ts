import { fetchExternal } from "./fetchExternal";
import { forProject } from "@truffle/decoder";
import type { Transaction } from "@truffle/decoder";
import TruffleConfig from "@truffle/config";

const provider; // TODO: Make this work

/**
 * 
 * param {Compile.sources()
-----------------
returns WorkflowCompileResult
db-kit's fetchExternal()
------------------------
invokes Compile.sources()
shims WorkflowCompileResult -> DB's Compilation
side-effectly saves to DB
queryCompilation
----------------
reads DB's Compilation format from DB
returns DB's Compilation
prepareProjectInfo
------------------
accepts as argument a DB Compilation
returns a Decoder ProjectInfo object} txParams 

We may be able to skip truffle-db, by writing a shim ourselves from the fetchExternal's internal format (WorkflowCompileResult) to dbCompilationk
 */

interface TxDecodeOpts {
  txParams: Transaction;
  networkId: string;
}

export async function getProjectInfoForTransaction (opts: TxDecodeOpts) {

  const config = TruffleConfig.default().merge({
    networks: {
      '1': {
        url: process.env['MAINNET_URL'],
        network_id: 1,
      }
    },
    network: opts.networkId,
    // May need to make a more proper truffle config, will see. TODO
    sourceFetchers: ['etherscan'],
    etherscan: {
        apiKey: process.env['ETHERSCAN_KEY'],
    }
  });

  if (!opts.txParams.to) {
    throw new Error('contract creation txs not currently supported.')
  }

  // Fetch metadata from etherscan
  // db-kit fetchExternal src/utils/fetchExternal.ts
  // Saves to truffle-db in its own format
  const projectInfo = await fetchExternal({
    address: opts.txParams.to,
    config,
  });


  return projectInfo

  // On client side:
  // const decoder = await forProject(provider, projectInfo);
  // const decoding = await decoder.decodeTransaction(txParams);
}