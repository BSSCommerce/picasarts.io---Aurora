var MarketPlace = artifacts.require("MarketPlace");
var CollectionFactory = artifacts.require("CollectionFactory");
var ReefRoyalty = artifacts.require("ReefRoyalty");

module.exports = function(deployer) {
    deployer.deploy(MarketPlace);
    deployer.deploy(CollectionFactory, 0);
    deployer.deploy(ReefRoyalty, "Picasarts", "ETH", "0xBE47fC181f5704704c92dC8518950ff12d243584");
};