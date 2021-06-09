import TruffleConfig from "@truffle/config";
import type * as Decoder from "@truffle/decoder";

import { fetchExternal } from "./fetchExternal";

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

export interface GetProjectInfoForTransactionOptions {
  to: string;
  networkId: string;
  config: TruffleConfig;
}

export async function getProjectInfoForTransaction({
  to,
  config
}: GetProjectInfoForTransactionOptions): Promise<Decoder.ProjectInfo> {
  // Fetch metadata from etherscan
  // db-kit fetchExternal src/utils/fetchExternal.ts
  // Saves to truffle-db in its own format
  const projectInfo = await fetchExternal({
    address: to,
    config: config
  });

  return projectInfo;

  // On client side:
  // const decoder = await forProject(provider, projectInfo);
  // const decoding = await decoder.decodeTransaction(txParams);
}
