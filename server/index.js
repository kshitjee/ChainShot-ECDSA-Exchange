const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("@noble/secp256k1");
const SHA256 = require("crypto-js/sha256");

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

// account 1
let privateKey1 = secp.utils.randomPrivateKey();
privateKey1 = Buffer.from(privateKey1).toString("hex");
let publicKey1 = secp.getPublicKey(privateKey1);
publicKey1 = Buffer.from(publicKey1).toString("hex");

// account 2
let privateKey2 = secp.utils.randomPrivateKey();
privateKey2 = Buffer.from(privateKey2).toString("hex");
let publicKey2 = secp.getPublicKey(privateKey2);
publicKey2 = Buffer.from(publicKey2).toString("hex");

// account 3
let privateKey3 = secp.utils.randomPrivateKey();
privateKey3 = Buffer.from(privateKey3).toString("hex");
let publicKey3 = secp.getPublicKey(privateKey3);
publicKey3 = Buffer.from(publicKey3).toString("hex");

// accounts database
var accounts = {
  account1: {
    publicKey: publicKey1,
    privateKey: privateKey1,
    balance: 100,
  },
  account2: {
    publicKey: publicKey2,
    privateKey: privateKey2,
    balance: 50,
  },
  account3: {
    publicKey: publicKey3,
    privateKey: privateKey3,
    balance: 75,
  },
};

var balances = {};
for (const account in accounts) {
  balances[accounts[account].publicKey] = accounts[account].balance;
}
// logging info
console.log("Available Accounts");
accounts.account3.publicKey, console.log("==================");
console.log(
  "(0) ",
  accounts.account1.publicKey,
  " ",
  accounts.account1.balance
);
console.log(
  "(1) ",
  accounts.account2.publicKey,
  " ",
  accounts.account2.balance
);
console.log(
  "(2) ",
  accounts.account3.publicKey,
  " ",
  accounts.account3.balance,
  "\n"
);

console.log(accounts.account1.privateKey.length);
console.log("Private Keys");
console.log("==================");
console.log("(0) ", accounts.account1.privateKey);
console.log("(1) ", accounts.account2.privateKey);
console.log("(2) ", accounts.account3.privateKey);

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  async function signAndVerify() {
    // user will sign the transaction
    var msgHash = SHA256(
      JSON.stringify({ sender, recipient, amount })
    ).toString();
    var pk = "";
    for (const account in accounts) {
      if (accounts[account].publicKey === sender) {
        pk = accounts[account].privateKey;
      }
    }
    var signature = await secp.sign(msgHash, pk);
    // verify the transaction
    var verify = secp.verify(signature, msgHash, sender);
    console.log(verify);

    return verify;
  }

  // change the balance if verification is complete
  try {
    if (signAndVerify()) {
      console.log(balances);
      balances[sender] -= amount;
      balances[recipient] = (balances[recipient] || 0) + +amount;
      res.send({ balance: balances[sender] });
      console.log(balances);
    }
  } catch (error) {
    console.log("verification error");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
