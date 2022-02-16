pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@opengsn/contracts/src/BaseRelayRecipient.sol";
import "./Royalties.sol";

contract AlpacaToken is
    Ownable,
    Pausable,
    ERC1155Supply,
    ERC2981ContractWideRoyalties,
    BaseRelayRecipient
{
    string public override versionRecipient = "2.0.0";
    uint24 private constant ROYALTIES = 500;

    string public name;
    string public symbol;

    uint256 public alexCounter = 50;

    mapping(bytes => uint8) employeeMapping;

    event NFTMinted(
        address indexed to,
        uint256 indexed employeeToken,
        uint256 indexed alexToken
    );

    constructor(
        string[] memory hashes,
        uint8[] memory tokenIds,
        address _forwarder
    )
        ERC1155(
            "ipfs://QmZix4bQSQAJ2dC2QiNsJrSC7PmL1vEE4BozHrxhsvMPMP/{id}.json"
        )
    {
        name = "Alpaca NFT";
        symbol = "ALPA";
        _setRoyalties(msg.sender, ROYALTIES);
        _setTrustedForwarder(_forwarder);

        for (uint8 i = 0; i < hashes.length; i++) {
            employeeMapping[bytes(hashes[i])] = tokenIds[i];
        }
    }

    function mintNFT(string memory hash) public whenNotPaused {
        uint8 tokenId = employeeMapping[bytes(hash)];
        require(tokenId > 0, "Token hash not found");
        require(!exists(tokenId), "Token already minted");
        require(tokenId <= 22, "Not a valid tokenId");

        // mint an Alex NFT
        _mint(_msgSender(), alexCounter, 1, "");
        alexCounter++;

        // mint employee NFT
        _mint(_msgSender(), tokenId, 1, "");

        emit NFTMinted(_msgSender(), tokenId, alexCounter - 1);
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

    function _msgData()
        internal
        view
        virtual
        override(Context, BaseRelayRecipient)
        returns (bytes calldata ret)
    {
        return super._msgData();
    }

    function _msgSender()
        internal
        view
        virtual
        override(Context, BaseRelayRecipient)
        returns (address ret)
    {
        return super._msgSender();
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
