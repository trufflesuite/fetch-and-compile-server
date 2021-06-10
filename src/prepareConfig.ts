import TruffleConfig from "@truffle/config";

export interface PrepareConfigOptions {
  mainnetUrl?: string;
  etherscanApiKey?: string;
}

export const prepareConfig = async (
  options: PrepareConfigOptions = {}
): Promise<TruffleConfig> => {
  const {
    mainnetUrl = process.env["MAINNET_URL"],
    etherscanApiKey = process.env["ETHERSCAN_KEY"]
  } = options;

  if (!mainnetUrl) {
    throw new Error("Missing mainnetUrl. Did you define ENV var?");
  }
  if (!etherscanApiKey) {
    throw new Error("Missing etherscanApiKey. Did you define ENV var?");
  }

  const config = TruffleConfig.default().merge({
    networks: {
      mainnet: {
        url: mainnetUrl,
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
      apiKey: etherscanApiKey
    }
  });

  return config;
};
