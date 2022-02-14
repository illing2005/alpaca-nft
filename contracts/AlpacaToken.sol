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
            "ipfs://QmXeRDZUewPN3cep4wGWJkAYYaRexnNciqqu3sCpBMAbir/{id}.json"
        )
    {
        name = "Alpaca NFT";
        symbol = "ALPA";
        _setRoyalties(msg.sender, ROYALTIES);
        for (uint256 i = 0; i <= 22; i++) {
            _mint(msg.sender, i, 1, "");
        }
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
            "ipfs://QmXeRDZUewPN3cep4wGWJkAYYaRexnNciqqu3sCpBMAbir/contract_metadata.json";
    }
}
