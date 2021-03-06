import dotenv from "dotenv";
import util from "util";

import * as Codec from "@truffle/codec";
import TruffleConfig from "@truffle/config";
import { forAddress, ProjectInfo } from "@truffle/decoder";

import { getProjectInfoForTransaction } from "../src";

dotenv.config();

describe("getProjectInfoForTransaction", () => {
  it("gets the info we expect", async () => {
    // A complex airswap tx:
    const original =
      "0x67641c2f00000000000000000000000000000000000000000000000000000177b6486a7400000000000000000000000000000000000000000000000000000000602ed7f236372b070000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080c886232e9b7ebbfb942b5987aa00000000000000000000000027054b13b1b798b345b591a4d22e6562d47ea75a0000000000000000000000000000000000000000000000000000000008f0d180000000000000000000000000000000000000000000000000000000000000000036372b07000000000000000000000000000000000000000000000000000000000000000000000000000000004b203f54429f7d3019c0c4998b88f8f3517f8352000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000298a051db5f5ea00000000000000000000000000000000000000000000000000000000000000000036372b0700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008bb52b2f23008ba58939ff59a8f3f20000000000000000000000004572f2554421bd64bef1c22c8a81840e8d496bea0100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001b5fcb0cc856bd0afc89493be7bb0e751a9b876b0faebe3086697b3c6c78e4efd3370a7eef528987c13555fd264d96b45af3277b555f9f4f4f6ebf9eb62d3fec2f";
    const txParams = {
      from: "0x4b203f54429f7d3019c0c4998b88f8f3517f8352",
      to: "0x28de5c5f56b6216441ee114e832808d5b9d4a775",
      input: original,
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

    const projectInfo: ProjectInfo = await getProjectInfoForTransaction({
      to: txParams.to,
      networkId: "1",
      config
    });

    expect(projectInfo).toBeTruthy();
    expect(projectInfo.compilations).toBeTruthy();

    // On client side:
    const decoder = await forAddress(txParams.to, config.provider, projectInfo);
    const decoding = await decoder.decodeTransaction(txParams);

    // @ts-ignore to gloss over non-FunctionDecodings for now
    for (const arg of decoding.arguments) {
      console.log(arg.name);
      console.log(
        util.inspect(
          new Codec.Format.Utils.Inspect.ResultInspector(arg.value),
          {
            colors: true,
            depth: null,
            maxArrayLength: null,
            breakLength: 80
          }
        )
      );
    }

    // console.log(JSON.stringify(decoding, null, 2));
    expect(decoding).toBeTruthy();
  }, 20000);
});
