var MarketPlace = artifacts.require("MarketPlace");
var CollectionFactory = artifacts.require("CollectionFactory");
var ReefRoyalty = artifacts.require("ReefRoyalty");

module.exports = function(deployer) {
    deployer.deploy(MarketPlace);
    deployer.deploy(CollectionFactory, 0);
    deployer.deploy(ReefRoyalty);
};