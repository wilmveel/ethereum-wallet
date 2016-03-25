var Web3 = require('web3');
var ethereumjsTx = require('ethereumjs-tx');
var ethereumjsUtil = require('ethereumjs-util');
var HookedWeb3Provider = require('hooked-web3-provider');

var username = 'willem';
var password = '123456';

var web3 = new Web3();


var hash = web3.sha3(username + ":" + password);

console.log("hash", hash);

var privateKey = new Buffer(hash, 'hex');

console.log("privateKey", privateKey);

var signer = {

    hasAddress: function (address, callback) {
        callback(null, true)
    },
    signTransaction: function (tx_params, callback) {

        //tx_params.nonce = '0x01';
        tx_params.gasPrice = '0xba43b7400';
        tx_params.gasLimit = '0x271000';
        tx_params.value = '0x01';

        console.log(tx_params);

        var tx = new ethereumjsTx(tx_params);
        console.log(tx);
        tx.sign(privateKey);

        var senderAddress = ethereumjsUtil.bufferToHex(tx.getSenderAddress());
        console.log('senderAddress', senderAddress);

        var balance = web3.eth.getBalance(senderAddress);
        console.log('balance', balance.toString());

        var buffer = new Buffer(tx.serialize());
        var signedTx = ethereumjsUtil.bufferToHex(buffer);

        console.log('signedTx', signedTx);

        callback(null, ethereumjsUtil.stripHexPrefix(signedTx));
    }


};

var hookedWeb3Provider = new HookedWeb3Provider({
    host: "/web3",
    transaction_signer: signer
});

web3.setProvider(hookedWeb3Provider);

var source = "" +
    "contract test {\n" +
    "uint private time;\n" +
    "string user;\n" +
    "string app;\n" +
    "function test(string username, string appname){user = username;app = appname;}\n " +
    "function GrantPermission(){time = now + 1 hours;}\n" +
    "   function CheckPermission() constant returns(string check) {\n" +
    "       if(time > now) return user;\n" +
    "   }\n" +
    "function RevokePermission(address coins){selfdestruct(coins);}\n" +
    "function GetAppName()constant returns(string name){return app;}\n" +
    "}\n";

var compiled = web3.eth.compile.solidity(source);
var abi = compiled.test.info.abiDefinition;
var code = compiled.test.code;

var gasPrice = 500;
var gas = 500000000;

web3.eth.contract(abi).new({
    from: '0xdd2b79bbcef7ed2ce6712eb0e8f5d1e309491236',
    gasPrice: gasPrice,
    gas: gas,
    data: code
}, function (err, contract) {
    if (err) {
        console.log("Contract creation error", err);
    } else if (contract.address) {
        console.log("Contract Created", contract.address);
    }
});
