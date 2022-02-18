const AlpacaToken = artifacts.require("AlpacaToken");
const Paymaster = artifacts.require("Paymaster");
const fs = require("fs");

const { hashes, tokenIds } = require("./employee_hashes.json");

config = {
  "rinkeby-fork": {
    "relayer": "0x6650d69225CA31049DB7Bd210aE4671c0B1ca132",
    "forwarder": "0x83A54884bE4657706785D7309cf46B58FE5f6e8a"
  },
  "rinkeby": {
    "relayer": "0x6650d69225CA31049DB7Bd210aE4671c0B1ca132",
    "forwarder": "0x83A54884bE4657706785D7309cf46B58FE5f6e8a"
  },
  "maticTestnet": {
    "relayer": "0x6646cD15d33cE3a6933e36de38990121e8ba2806",
    "forwarder": "0x4d4581c01A457925410cd3877d17b2fd4553b2C5"
  },
  "matic": {
    "relayer": "0x6C28AfC105e65782D9Ea6F2cA68df84C9e7d750d",
    "forwarder": "0xdA78a11FD57aF7be2eDD804840eA7f4c2A38801d"
  },
}



module.exports = function (deployer) {
  // console.log(deployer)
  const data = config[deployer.network];
  console.log(data)
  deployer
    .deploy(
      AlpacaToken,
      hashes,
      tokenIds,
      data.forwarder
    )
    .then((tokenContract) => {
      return deployer.deploy(Paymaster).then(async (paymasterContract) => {
        await paymasterContract.setRelayHub(
          data.relayer
        );
        await paymasterContract.setTrustedForwarder(
          data.forwarder
        );
        await paymasterContract.setTarget(AlpacaToken.address);
        const accounts = await web3.eth.getAccounts();
        web3.eth.sendTransaction({
          from: accounts[0],
          to: Paymaster.address,
          value: web3.utils.toWei("0.05", "ether"),
        });

        let config = {
          alpacaToken: AlpacaToken.address,
          paymaster: Paymaster.address,
        };
        fs.writeFileSync(
          __dirname + "/../app/src/contracts/config.json",
          JSON.stringify(config, null, "\t"),
          "utf-8"
        );
      });
    });
};
