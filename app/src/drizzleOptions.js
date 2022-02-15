import Web3 from "web3";
import AlpacaToken from "./contracts/AlpacaToken.json";

const options = {
  web3: {
    block: false,
    // customProvider: new Web3("ws://localhost:8545"),
  },
  contracts: [AlpacaToken],
  events: {
    AlpacaToken: ["NFTMinted"],
  },
};

export default options;
