import chalk from "chalk";
import { execSync } from "child_process";
import axios from "axios";

async function listVersions(): Promise<string[]> {
  const url =
    "https://registry.hub.docker.com/v1/repositories/ethereum/solc/tags";

  const {
    data
  }: {
    data: { name: string }[];
  } = await axios(url);

  const tags = data.map(({ name }) => name);
  const releasedTags = tags.filter(
    tag => !!tag.match(/^[0-9]+\.[0-9]+\.[0-9]+$/)
  );

  return releasedTags;
}

async function obtainVersion(version: string) {
  console.log(chalk.bold("Pulling docker image for version %s"), version);
  execSync(`docker pull ethereum/solc:${version}`, {
    stdio: "inherit"
  });
  console.log("");
}

async function main() {
  const versions = await listVersions();

  for (const version of versions) {
    await obtainVersion(version);
  }
}

main();
