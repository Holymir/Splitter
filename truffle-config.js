module.exports = {

  networks: {
    development: {
      host: "localhost",
      port: 8545,
      gas: 6721975,
      network_id: "*"
    },    
    
    "ganache": {
      host: "127.0.0.1",
      port: 7545,
      gas: 6721975,
      network_id: "*"
    }
  }
};



