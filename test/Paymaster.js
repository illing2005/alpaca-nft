Gsn = require("@opengsn/provider");

const { GsnTestEnvironment } = require("@opengsn/cli/dist/GsnTestEnvironment");
const AlpacaToken = artifacts.require("AlpacaToken");

describe("Test use of GSN network", () => {
  let alpacaToken;
  let from;
  let forwarder;
  let paymasterAddress;
  let netid;

  before(async function () {
    this.timeout(60000); //startGsn takes few seconds
    netid = await web3.eth.net.getId();

    //only ganache is running. start GSN with each test:
    let env = await GsnTestEnvironment.startGsn("localhost");
    paymasterAddress = env.contractsDeployment.paymasterAddress;
    forwarder = env.contractsDeployment.forwarderAddress;

    const config = {
      paymasterAddress,
      loggerConfiguration: {
        logLevel: "error",
      },
    };
    provider = Gsn.RelayProvider.newProvider({
      provider: web3.currentProvider,
      config,
    });
    await provider.init();

    //create a new gasless account:
    from = web3.utils.toChecksumAddress(provider.newAccount().address);
  });

  after(async () => {
    await GsnTestEnvironment.stopGsn();
  });

  it("should mint a token for free", async function () {
    this.timeout(60000);

    const accounts = await web3.eth.getAccounts();
    //deploy on ganache
    alpacaToken = await AlpacaToken.new(["test"], [1], forwarder, {
      from: accounts[0],
      useGSN: false,
    });

    //required: truffle allows too much gas for inner transaction. must estimate or set a lower gas limit
    AlpacaToken.defaults({ ...AlpacaToken.defaults(), gas: undefined });

    //NOTE: this is required only in truffle tests: the "artifacts.require" is called
    // before we could update the global web3's provider
    AlpacaToken.web3.setProvider(provider);

    const balBefore = await web3.eth.getBalance(from);
    await alpacaToken.mintNFT("test", { from });
    const balAfter = await web3.eth.getBalance(from);
    const token = await alpacaToken.balanceOf.call(from, 1);
    assert.equal(balBefore, balAfter);
    assert.equal(token, 1);
  });
});
