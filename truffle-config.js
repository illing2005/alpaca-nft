const path = require("path");
const fs = require("fs");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const infuraKey = fs.readFileSync(".infura").toString().trim();
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    develop: {
      // default with truffle unbox is 7545, but we can use develop to test changes, ex. truffle migrate --network develop
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*' // Match any network id
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://rinkeby.infura.io/v3/${infuraKey}`
        ),
      skipDryRun: true,
      network_id: 4, // rinkeby's id
      gas: 4500000, // rinkeby has a lower block limit than mainnet
      gasPrice: 10000000000,
    },
    maticTestnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://polygon-mumbai.infura.io/v3/${infuraKey}`),
      network_id: 80001,
      confirmations: 1,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 4500000, // rinkeby has a lower block limit than mainnet
      gasPrice: 10000000000,
    },
    matic: {
      provider: () => new HDWalletProvider(mnemonic, `https://polygon-mainnet.infura.io/v3/${infuraKey}`),
      network_id: 137,
      // confirmations: 1,
      // timeoutBlocks: 200,
      // skipDryRun: true,
      // gas: 4500000, // rinkeby has a lower block limit than mainnet
      gasPrice: 100000000000,
    },
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.11", // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    },
  },
};
