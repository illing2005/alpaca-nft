pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "./Royalties.sol";

contract AlpacaToken is
    Ownable,
    Pausable,
    ERC1155Supply,
    ERC2981ContractWideRoyalties
{
    uint24 private constant ROYALTIES = 500;

    string public name;
    string public symbol;

    constructor()
        ERC1155(
            "ipfs://QmZix4bQSQAJ2dC2QiNsJrSC7PmL1vEE4BozHrxhsvMPMP/{id}.json"
        )
    {
        name = "Alpaca NFT";
        symbol = "ALPA";
        _setRoyalties(msg.sender, ROYALTIES);

        // mint employee NFTs
        for (uint256 i = 1; i <= 22; i++) {
            _mint(msg.sender, i, 1, "");
        }
        // mint an Alex NFT
        _mint(msg.sender, 55, 1, "");
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, ERC2981Base)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function togglePause(bool newPaused) public onlyOwner {
        if (newPaused) {
            _pause();
        } else {
            _unpause();
        }
    }

    function contractURI() public pure returns (string memory) {
        return
            "ipfs://QmZix4bQSQAJ2dC2QiNsJrSC7PmL1vEE4BozHrxhsvMPMP/contract_metadata.json";
    }
}
