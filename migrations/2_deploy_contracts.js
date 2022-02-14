const AlpacaToken = artifacts.require("AlpacaToken");

module.exports = function (deployer) {
  deployer.deploy(AlpacaToken);
};
