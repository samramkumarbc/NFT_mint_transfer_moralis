

Moralis.start({ serverUrl: "https://etd9xajj2qrs.usemoralis.com:2053/server", appId: "10WLFNKf7x3Tg3ax66JcLGfy0qMX6NMvFrpz5SZB"});
//Moralis.initialize("H3iXrS0QQRTqM5CbrDP56YzMUg9BJj3TatZeo4e8");
//Moralis.serverURL = "https://cfit56bu6ltr.usemoralis.com:2053/server";
const CONTRACT_ADDRESS = "0xe00cccfc488f47e05e505df24ea9678f5c4ecc21";
let currentUser;

function renderInventory1(NFTs){
    const parent = document.getElementById("app");
    for (let i = 0; i < NFTs.result.length; i++) {
        const nft = (NFTs.result[i]);
        
        
        let getmimage = (nft.metadata).substring((nft.metadata).indexOf("image")+8, (nft.metadata).indexOf("description")-3);
        let getmname = (nft.metadata).substring((nft.metadata).indexOf("name")+7, (nft.metadata).indexOf("}")-1);
        let getmdescription = (nft.metadata).substring((nft.metadata).indexOf("description")+14, (nft.metadata).indexOf("name")-3);

       
        

        let htmlString = `<div class="card">
        <img class="card-img-top" src="${getmimage}" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">${getmname}</h5>
          <p class="card-text">${getmdescription}</p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
        </div>`

      let col = document.createElement("div");
      col.className = "col col-md-3"
      col.innerHTML = htmlString;
      parent.appendChild(col);
    }
}

function renderInventory(NFTs, ownerData){
  const parent = document.getElementById("app");
  for (let i = 0; i < NFTs.length; i++) {
    const nft = NFTs[i];
    //console.log(nft);
    let htmlString = 
    `<div class="card">
    <img class="card-img-top" src="${nft.metadata.image}" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">${nft.metadata.name}</h5>
      <p class="card-text">${nft.metadata.description}</p> 
      <p class="card-text">Amount : ${nft.amount}</p>
      <p class="card-text">Number of owners: ${nft.owners.length}</p>
      <p class="card-text">Your balance: ${ownerData[nft.token_id]}</p>
      <a href="/mint.html?nftId=${nft.token_id}" class="btn btn-primary">Mint</a>
      <a href="/transfer.html?nftId=${nft.token_id}" class="btn btn-primary">Transfer</a>
    </div>
    </div>`
    console.log(nft.metadata.image);
    console.log(nft.metadata.name);
    console.log(nft.metadata.description);

    let col = document.createElement("div");
    col.className = "col col-md-3"
    col.innerHTML = htmlString;
    parent.appendChild(col);
    
  }
}

function fetchNFTMetadata(NFTs){
  let promises = [];
  for (let i = 0; i < NFTs.length; i++) {
    const nft = NFTs[i];
    let id = nft.token_id;
    //setTimeout(() => { console.log("World!"); }, 1000);
    
    promises.push( fetch("https://etd9xajj2qrs.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=10WLFNKf7x3Tg3ax66JcLGfy0qMX6NMvFrpz5SZB&nftId=" + id)
    .then(res => res.json())
    .then(res => JSON.parse(res.result))
    .then(res => {nft.metadata = res})
    .then(res => {
      const options = { address: CONTRACT_ADDRESS, token_id: id, chain: "rinkeby"};
      return Moralis.Web3API.token.getTokenIdOwners(options)   
    })
    .then( (res) => {
      nft.owners = [];
      res.result.forEach(element =>{
        nft.owners.push(element.owner_of);
        });
      return nft;
      //console.log(res)
    }))
  }
  return Promise.all(promises);
}

async function getOwnerData(NFTs){
  let accounts = currentUser.get("accounts");
  for (let i = 0; i < NFTs.length; i++) {
  const options = { chain: 'rinkeby', address: accounts[i], token_address: CONTRACT_ADDRESS };
  return Moralis.Web3API.account.getNFTsForContract(options).then((data) => {
    
    let result = data.result.reduce ((object, currentElement) => {
      
      object[currentElement.token_id] = currentElement.amount;
      return object;
    }, {})
    //console.log(result);
    return result;
  })
}
  
}


async function initializeApp(){
    currentUser = Moralis.User.current();
    if(!currentUser){
        currentUser = await Moralis.Web3.authenticate();
    }

    const options = { address: CONTRACT_ADDRESS, chain: "rinkeby"};
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    //console.log(NFTs);

    //    let id = NFTs.result[0].token_id;
    //const options1 = { address: CONTRACT_ADDRESS, token_id: id, chain: "rinkeby"};
    //let NFTOwners =  Moralis.Web3API.token.getTokenIdOwners(options1);
    //console.log(NFTOwners);
    //console.log(NFTs.result.token_id);

    let NFTWithMetadata = await fetchNFTMetadata(NFTs.result); 
    let ownerData = await getOwnerData(NFTs.result);
    //let ownerData = await Moralis.Web3.authenticate();
    //setTimeout(fetchNFTMetadata, 3000, NFTs);

    //console.log(NFTWithMetadata);
    
    renderInventory(NFTWithMetadata, ownerData);
}

initializeApp();