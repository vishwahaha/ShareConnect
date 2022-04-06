var UserStorage = artifacts.require("./UserStorage.sol");
var FileShare = artifacts.require("./FileShare.sol");
var GlobalShare = artifacts.require("./GlobalShare.sol");

module.exports = function(deployer) {
  deployer.deploy(UserStorage);
  deployer.deploy(FileShare);
  deployer.deploy(GlobalShare);
};
