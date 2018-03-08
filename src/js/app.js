App = {
  web3Provider: null,
  contracts: {},

  init: function() {   

    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

        return App.initContract();
        //return App.bindEvents();
    },

  initContract: function() {
    $.getJSON('Splitter.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var SplitterArtifact = data;
      App.contracts.Splitter = TruffleContract(SplitterArtifact);

      // Set the provider for our contract
      App.contracts.Splitter.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      //return App.markAdopted();
  });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#sendClick', App.handleSplit);
    $(document).on('click', '#getClick', App.handleGet);
  },

  handleGet: function(event) {

    //event.preventDefault();    
    console.log("get hitted")

    var splitterInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      //console.log(account.toString());

      App.contracts.Splitter.deployed().then(function(instance) {
        splitterInstance = instance;

        // Execute adopt as a transaction by sending account
        return splitterInstance.show(account);
      }).then(function(result) {
        console.log(result);
        //return App.bindEvents();
      }).catch(function(err) {
        console.log(err.message);
      });
    });

  },

  handleSplit: function(event) {
    event.preventDefault();
    console.log("split hitted")

    var addr1 = $('#addr1').val();
    var addr2 = $('#addr2').val();
    var amount = $('#amount').val();

    var splitterInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      // var tx = {from: web3.eth.accounts[1]};
      // SubCoin.send.sendTransaction(web3.eth.accounts[0], 1000, tx);

      var account = accounts[0];
      //console.log(account);
      //var tx = {from: account};

      App.contracts.Splitter.deployed().then(function(instance) {
        splitterInstance = instance;

        // Execute adopt as a transaction by sending account
        splitterInstance.split(addr1, addr2, {value: web3.toWei(amount, 'ether')});
      }).then(function(result) {
        console.log(result);
        //return App.bindEvents();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
