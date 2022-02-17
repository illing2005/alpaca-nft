import Web3 from "web3";
import React, { useEffect, useState } from "react";
import Config from "./contracts/config.json";
import MainComponent from "./MainComponent";
import AlpacaToken from "./contracts/AlpacaToken.json";
const { RelayProvider } = require("@opengsn/provider");

let context = {
  web3: null,
  alpacaToken: null,
  account: null,
  initialized: false,
};

const App = () => {
  const [metaMaskAvailable, setMetaMaskAvailable] = useState(true);
  const [gsnInitialized, setGsnInitialized] = useState(false);

  // Initialize GSN and contracts
  useEffect(() => {
    const init = async () => {
      const config = {
        paymasterAddress: Config.paymaster,
        chainId: process.env.REACT_APP_CHAIN_ID,
        loggerConfiguration: {
          logLevel: "error",
        },
      };
      const provider = await RelayProvider.newProvider({
        provider: window.web3.currentProvider,
        config,
      }).init();
      context.web3 = new Web3(provider);
      context.alpacaToken = new context.web3.eth.Contract(
        AlpacaToken.abi,
        Config.alpacaToken
      );
      context.account = (await context.web3.eth.getAccounts())[0];
      context.initialized = true;
      setGsnInitialized(true);
    };
    init();
  }, []);

  // Switch to contract network
  useEffect(() => {
    if (process.env.REACT_APP_ENVIRONMENT === "production") {
      if (window.ethereum) {
        const switchNetwork = async () => {
          window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: process.env.REACT_APP_CHAIN_ID,
                chainName: process.env.REACT_APP_CHAIN_NAME,
                nativeCurrency: {
                  name: process.env.REACT_APP_CHAIN_CURRENCY,
                  symbol: process.env.REACT_APP_CHAIN_CURRENCY,
                  decimals: 18,
                },
                rpcUrls: [process.env.REACT_APP_RPC_URL],
                blockExplorerUrls: [process.env.REACT_APP_BLOCK_EXPLORER],
              },
            ],
          });
        };
        switchNetwork();
      } else {
        setMetaMaskAvailable(false);
      }
    }
  }, []);

  return (
    <MainComponent metaMaskAvailable={metaMaskAvailable} context={context} />
  );
};

export default App;
