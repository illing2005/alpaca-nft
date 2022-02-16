import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Footer from "./Footer";
import Header from "./Header";
import MintModal from "./MintModal";
import Image from "react-bootstrap/cjs/Image";
import Alert from "react-bootstrap/Alert";

const MainComponent = ({ drizzleContext, metaMaskAvailable }) => {
  const [currentStackId, setCurrentStackId] = useState(-1);
  const [show, setShow] = useState(false);
  const [mintKey, setMintKey] = useState(null);
  const [assets, setAssets] = useState([]);
  let txState;
  let txHash;

  const { drizzle, drizzleState, initialized } = drizzleContext;
  if (initialized && drizzleState.transactionStack[currentStackId]) {
    txHash = drizzleState.transactionStack[currentStackId];
    txState = drizzleState.transactions[txHash]?.status;
  }
  useEffect(() => {
    const fetchOpenSea = async () => {
      if (initialized) {
        const options = { method: "GET" };
        const account = drizzleState.accounts[0];
        const contract = drizzle?.contracts.AlpacaToken.address;
        const result = await fetch(
          `https://testnets-api.opensea.io/api/v1/assets?owner=${account}&asset_contract_address=${contract}&order_direction=desc&offset=0&limit=20`,
          options
        );
        setAssets(await result.json());
      }
    };
    fetchOpenSea();
  }, [initialized]);

  const mintNFT = async () => {
    setShow(true);
    const { AlpacaToken } = drizzle?.contracts;
    const gasPrice = await drizzle.web3.eth.getGasPrice();
    const stackId = await AlpacaToken.methods.mintNFT.cacheSend(mintKey, {
      gasLimit: "500000",
      gasPrice,
    });
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
          <div className="col-6 offset-3" style={{ marginBottom: 20 }}>
            <Form.Control
              type="text"
              placeholder="Enter your mint key"
              value={mintKey}
              onChange={(e) => setMintKey(e.target.value)}
            />
          </div>
          <Button
            className={"btn btn-lg btn-orange"}
            onClick={mintNFT}
            disabled={!metaMaskAvailable}
          >
            {initialized ? "Mint NFT" : "Loading..."}
          </Button>
        </p>
        {!metaMaskAvailable && (
          <Alert variant="danger">
            You have to install{" "}
            <a
              href="https://metamask.io/"
              target="_blank"
              rel="noopener norefferer"
            >
              MetaMask
            </a>{" "}
            to be able mint your NFT
          </Alert>
        )}
        <div style={{ height: 150 }}>
          {assets?.assets?.length > 0 && (
            <>
              <div>Your Alpaca NFTs:</div>
              <div>
                {assets?.assets?.map((img) => {
                  return (
                    <a
                      href={img.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={img.image_url}
                        key={img.id}
                        style={{ height: 100 }}
                      />
                    </a>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
      <MintModal
        show={show}
        handleClose={() => setShow(false)}
        txState={txState}
        txHash={txHash}
      />
      <Footer />
    </div>
  );
};

export default MainComponent;
