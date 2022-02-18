# Alpaca Employee NFT

Using this App Alpaca employees can mint their personal Alpaca Avatar NFT. 
On top of that they also get an Alex the Alpacabot NFT (limited to 50 tokens).

## Deployment:

### Frontend:
The frontend is deployed using github pages:

https://illing2005.github.io/alpaca-nft/

### Contracts
The smart contracts are deployed to the rinkeby test network:
- AlpacaToken: [0x5142c1C5a0ac892998b3Eb5246C059B92F23D96d](https://rinkeby.etherscan.io/address/0x5142c1C5a0ac892998b3Eb5246C059B92F23D96d)
- Paymaster: [0xB856cfa24Cc3212bFC864e84d2e5c905Bd8d5E50](https://rinkeby.etherscan.io/address/0xB856cfa24Cc3212bFC864e84d2e5c905Bd8d5E50)

## Features

### Frontend
- users mint their NFT using a key and gas-less meta-transactions
- uses OpenSea API to display already minted tokens of the user
- send network change request if metamask is not connected to the correct network

### Solidity Contracts
- implement the `ERC1155` token standard.
- key protected `mintNFT` function that maps the key to a specific NFT
- whitelist paymaster contract to allow gas-less meta-transactions
- implements `IERC2981Royalties` for NFT royalties

### Meta Transactions
Meta-transactions allow users to send transactions without paying the gas fee.
The actual transaction is routed via RelayHub and a trusted forwarder to the actual contract and a 
separate Paymaster contract takes care of paying the gas fees.
[Read more about meta-transactions](https://docs.opengsn.org/#the-problem).

Meta-transactions are implemented using the [GSNv2 standard](https://opengsn.org/).
