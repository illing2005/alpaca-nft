const AlpacaToken = artifacts.require("AlpacaToken");

contract("AlpacaToken", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];

  describe("Is Ownable and Resumable", function () {
    beforeEach(async function () {
      const { hashes, tokenIds } = require("../migrations/employee_hashes.json");

      this.contract = await AlpacaToken.new(hashes, tokenIds, {
        from: account_one,
      });
    });
    it("should have correct owner", async function () {
      const owner = await this.contract.owner.call();
      assert.equal(owner, account_one);
    });

    it("should be pausable/resumable by owner", async function () {
      await this.contract.togglePause(true, { from: account_one });

      const paused = await this.contract.paused.call();
      assert.equal(paused, true, "It should be pausable");

      await this.contract.togglePause(false, { from: account_one });
      const unpaused = await this.contract.paused.call();
      assert.equal(unpaused, false, "It should be resumable");
    });

    it("sets royalties correctly", async function () {
      const amount = web3.utils.toWei("10", "ether");
      const royalties = await this.contract.royaltyInfo.call(1, amount);
      assert.equal(royalties["receiver"], account_one);
      assert.equal(
        royalties["royaltyAmount"],
        web3.utils.toWei("0.5", "ether")
      );
    });

    it("can mint a employee token", async function () {
      const alexId = await this.contract.alexCounter.call();

      await this.contract.mintNFT("sebastian_AGJE", { from: account_two });

      const employeeBalance = await this.contract.balanceOf.call(
        account_two,
        1
      );
      const alexBalance = await this.contract.balanceOf.call(
        account_two,
        alexId
      );

      assert.equal(employeeBalance, 1);
      assert.equal(alexBalance, 1);
    });
  });
});
