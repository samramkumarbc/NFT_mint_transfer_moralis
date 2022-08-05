

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
    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");
    document.getElementById("token_id_input").value = nftId;
}

async function transfer(){
    //let tokenId = parseInt(document.getElementById("token_id_input").value);
    let tokenId = document.getElementById("token_id_input").value;
    console.log(tokenId);
    let address = document.getElementById("address_input").value
    let amount = parseInt(document.getElementById("amount_input").value)
    
        const options = {type: "erc1155",
                    receiver: address,
                    contractAddress: CONTRACT_ADDRESS,
                    tokenId: tokenId,
                    amount: amount}
        let result = await Moralis.transfer(options);
        console.log(result);
}

document.getElementById("submit_transfer").onclick = transfer;
init();