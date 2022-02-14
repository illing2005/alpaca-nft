pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract AlpacaToken is Ownable, Pausable, ERC1155Supply {

    string public name;
    string public symbol;

    constructor()
        ERC1155(
            "ipfs://QmVsohKkEpXvGxfMPxZfgZ7bgPUgC3Pdjdzbn4tKZN546g/{id}.json"
        )
    {
        name = "Alpaca NFT";
        symbol = "ALPA";
        for (uint256 i = 0; i <= 22; i++) {
            _mint(msg.sender, i, 1, "");
        }
    }

    function togglePause(bool newPaused) public onlyOwner {
        if (newPaused) {
            _pause();
        } else {
            _unpause();
        }
    }
}
