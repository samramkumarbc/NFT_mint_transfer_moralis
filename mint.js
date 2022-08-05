

Moralis.start({ serverUrl: "https://etd9xajj2qrs.usemoralis.com:2053/server", appId: "10WLFNKf7x3Tg3ax66JcLGfy0qMX6NMvFrpz5SZB"});
//Moralis.initialize("H3iXrS0QQRTqM5CbrDP56YzMUg9BJj3TatZeo4e8");
//Moralis.serverURL = "https://cfit56bu6ltr.usemoralis.com:2053/server";
const CONTRACT_ADDRESS = "0xe00cccfc488f47e05e505df24ea9678f5c4ecc21";
let web3;

async function init(){
    let currentUser = Moralis.User.current();
    if(!currentUser){
        window.location.pathname = "/index.html";
    }

    web3 = await Moralis.Web3.enableWeb3();
    let accounts = await web3.eth.getAccounts();
    //console.log(accounts);


        //let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        //console.log(accounts[0]);


    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");
    console.log(nftId);
    document.getElementById("token_id_input").value = nftId;
    document.getElementById("address_input").value = accounts[0];
}

async function mint(){
    let tokenId = parseInt(document.getElementById("token_id_input").value);
    let address = document.getElementById("address_input").value
    let amount = parseInt(document.getElementById("amount_input").value)
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
    contract.methods.mint(address, tokenId, amount).send({from: accounts[0], value: 0})
    .on("receipt", function(receipt){
        alert("Mint done");
    })
}

document.getElementById("submit_mint").onclick = mint;
init();