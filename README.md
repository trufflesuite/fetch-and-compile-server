# Eth Tx Project Info Server

A simple node.js server for retrieving truffle-style [ProjectInfo](https://www.trufflesuite.com/docs/truffle/codec/interfaces/_truffle_decoder.projectinfo.html) for a given Ethereum contract.

- Fetches contract data from etherscan (if verified)
- Can easily be extended to support Sourcify later (for decentralization)
- Handles fetching solidity compilers, and caches them locally
- Operates deterministically, so can be parallelized and placed behind a load balancer for serving at scale.

Can be used to represent complex tx parameters, even nested structs.

## Usage

`yarn` to install dependencies.

Make sure your system has Docker installed.

Copy the `sample.env` file to `.env`, and fill in an infura URL, etherscan key, and desired port to serve on, to use as a server.

To host as a server, run `yarn start`.

The server accepts requests at `/tx`, with query parameters `from`, `to`, and `data` (per ethereum transaction fields).

To improve performance by pre-fetching solidity compilers, you can run `yarn obtain`.

## Testing

`yarn test`
