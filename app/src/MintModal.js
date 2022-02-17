import React from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/cjs/Spinner";

const MintModal = ({ show, handleClose, txState, txHash }) => {
  const showSpinner = txState !== "success" && txState !== "error";
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body className="mintModal">
        <div className="vertical-center">
          {showSpinner ? (
            <>
              <Spinner animation="border" style={{ color: "#ff6968" }} />
              <br />
              Processing Transaction <br />
              (This can take a few mins)
              <br />
              {txHash?.includes("0x") && (
                <a
                  href={`https://rinkeby.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Etherscan
                </a>
              )}
            </>
          ) : txState === "success" ? (
            <>
              <h3>
                Alpaca NFTs <br />
                successfully minted!
              </h3>
              <p>
                Note: It can take a few minutes until your NFTs show up in your
                wallet
              </p>
              <a
                href={`${process.env.REACT_APP_BLOCK_EXPLORER}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View transaction on Etherscan
              </a>
              <br />
              <a
                href={`${process.env.REACT_APP_OPEN_SEA}/account`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View NFTs on OpenSea
              </a>
            </>
          ) : (
            <>
              <h3>Ups something went wrong.</h3>
              <a
                href={`https://rinkeby.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View transaction on Etherscan
              </a>{" "}
              and{" "}
              <a href="#" onClick={handleClose}>
                try again
              </a>
              .
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default MintModal;
