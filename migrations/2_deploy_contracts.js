var UserStorage = artifacts.require("./UserStorage.sol");
var FileShare = artifacts.require("./FileShare.sol");

module.exports = function(deployer) {
  deployer.deploy(UserStorage);
  deployer.deploy(FileShare);
};
