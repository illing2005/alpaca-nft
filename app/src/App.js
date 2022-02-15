import React, {useState} from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";
import Button from "react-bootstrap/Button";
import Footer from "./Footer";
import Header from "./Header";

const drizzle = new Drizzle(drizzleOptions);

const App = () => {

  const [currentStackId, setCurrentStackId] = useState(-1);
  let transactionState;
  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {(drizzleContext) => {
          const { drizzle, drizzleState, initialized } = drizzleContext;
          console.log(drizzleState);
          if (initialized && drizzleState.transactionStack[currentStackId]) {
              console.log(drizzleState.transactionStack[currentStackId])
              const txHash = drizzleState.transactionStack[currentStackId];
              transactionState = drizzleState.transactions[txHash]?.status;
            }

          const mintNFT = async () => {
            console.log("start minting");
            const { AlpacaToken } = drizzle?.contracts;
            // console.log(AlpacaToken.methods.alexCounter);
            // console.log(AlpacaToken.methods.alexCounter.cacheCall());

            const stackId =
                await AlpacaToken.methods.mintNFT.cacheSend("thea_euqq");
            setCurrentStackId(stackId);
          };

          return (
            <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
              <Header />

              <main className="px-3">
                <h1>Get your personal Alpaca NFT</h1>
                <p className="lead">
                  Mint your Alpaca NFT now for free! <br />
                  You don't need to pay any transaction costs.
                </p>
                <p className="lead">
                  <Button className={"btn btn-lg btn-orange"} onClick={mintNFT}>
                    {initialized ? "Mint NFT" : "Loading..."}
                  </Button>
                </p>
                  <p>{transactionState}</p>
              </main>

              <Footer />
            </div>
          );
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  );
};

export default App;
