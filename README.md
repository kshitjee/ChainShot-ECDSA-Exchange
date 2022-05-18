This project is simple exchange that verifies transactions using digital signatures and asymmetric cryptography (public and private keys). 
I completed it in Week 1 of the ChainShot Bootcamp I did (04/25/2022 - 06/30/2022), after learning about Cryptographic Hashes, Digital Signatures (RSA and ECDSA), 
Public Key Cryptography, Mining/PoW and the Blockchain Data Structure. 
       
instructions-
1. to run client, cd to /client and use parclejs (https://parceljs.org/) on index.html- npx parcel index.html
2. on a seperate terminal tab, to run server, cd to /server and run node index - view initial accounts and balances
3. copy-paste sender, recipient in the front-end (public keys). enter amount of money to transfer. 
4. press "Send Amount" in the front-end. 
5. view change in senders' balance in front-end, view changes in everyone's balance on terminal tab that's running the server

/client 
1. index.html
2. index.js- makes requests to the server using browser fetch API (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
3. index.scss

/server  
1. index.js- 
    creates 3 different accounts with a public key, private key (using noble-secp256k library https://github.com/paulmillr/noble-secp256k1) and a balance.
    console logs the different public keys, private keys and respective balances.
    when a user enters transaction info (sender, recipient, amount) clicks on "Send Amount" =>
        signAndVerify() creates a digital signature with the SHA256 hash of the transaction info and the senders private key, then verifies the transaction using secp256
        => if verification is successful, transaction goes through and changes the respective account balances
        => change balance in the front-end
