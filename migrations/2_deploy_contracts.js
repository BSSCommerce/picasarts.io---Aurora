var MarketPlace = artifacts.require("MarketPlace");
var CollectionFactory = artifacts.require("CollectionFactory");

module.exports = function(deployer) {
    deployer.deploy(MarketPlace);
    deployer.deploy(CollectionFactory, 0);
};