import React, { useEffect, useState } from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";
import MainComponent from "./MainComponent";

const drizzle = new Drizzle(drizzleOptions);

const App = () => {

  const [metaMaskAvailable, setMetaMaskAvailable] = useState(true);

  useEffect(() => {
    // Switch to contract network
    if (process.env.REACT_APP_ENVIRONMENT !== "production") {
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
      } else{
        setMetaMaskAvailable(false);
      }

    }
  }, []);

  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {(drizzleContext) => {
          return <MainComponent drizzleContext={drizzleContext} metaMaskAvailable={metaMaskAvailable}/>;
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  );
};

export default App;
