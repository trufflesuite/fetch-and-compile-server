import { fetchAndCompile } from "@truffle/fetch-and-compile";

import type TruffleConfig from "@truffle/config";

import * as Decoder from "@truffle/decoder";
import * as Codec from "@truffle/codec";

export interface FetchExternalOptions {
  config: TruffleConfig;
  address: string;
}

export async function fetchExternal({
  config,
  address
}: FetchExternalOptions): Promise<Decoder.ProjectInfo> {
  const { compileResult: result } = await fetchAndCompile(address, config);

  const projectInfo = {
    compilations: Codec.Compilations.Utils.shimCompilations(result.compilations)
  };
  return projectInfo;
}
