# Eth Tx Project Info Server

A simple node.js server for retrieving truffle-style [ProjectInfo](https://www.trufflesuite.com/docs/truffle/codec/interfaces/_truffle_decoder.projectinfo.html) for a given Ethereum contract.

- Fetches contract data from etherscan (if verified)
- Can easily be extended to support Sourcify later (for decentralization)
- Handles fetching solidity compilers, and caches them locally
- Operates deterministically, so can be parallelized and placed behind a load balancer for serving at scale.

Can be used to represent complex tx parameters, even nested structs.

## Usage

`yarn` to install dependencies.

Copy the `sample.env` file to `.env`, and fill in an infura URL, etherscan key, and desired port to serve on, to use as a server.

To host as a server, run `yarn start`.

## Testing

`yarn test`
