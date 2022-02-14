const AlpacaToken = artifacts.require("AlpacaToken");

contract("AlpacaToken", (accounts) => {
  const account_one = accounts[0];

  describe("Is Ownable and Resumable", function () {
    beforeEach(async function () {
      this.contract = await AlpacaToken.new({ from: account_one });

    });
    it("should have correct owner", async function () {
      const owner = await this.contract.owner.call();
      assert.equal(owner, account_one);
    });

    it("should be pausable/resumable by owner", async function () {
      await this.contract.togglePause(true, {from: account_one});

      const paused = await this.contract.paused.call();
      assert.equal(paused, true, "It should be pausable");

      await this.contract.togglePause(false, {from: account_one});
      const unpaused = await this.contract.paused.call();
      assert.equal(unpaused, false, "It should be resumable");
    });
  });
});
