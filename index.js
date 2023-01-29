const test = false;

let tokenID = "";
let serialNumber = "";

if (test) {
  tokenID = "0.0.930110";
  serialNumber = "543";
} else {
  tokenID = prompt("token id");
  serialNumber = prompt("serial");
}

let totalVol = 0;
function formatDate(value) {
  let date = new Date(Math.round(Number(value)));
  let day = ("0" + date.getDate()).slice(-2);
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let formatDate = date.getFullYear() + "-" + month + "-" + day;
  return formatDate;
}

function getDays(first, last) {
  const date1 = new Date(first);
  const date2 = new Date(last);

  let Difference_In_Time = date2.getTime() - date1.getTime();
  let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  if (Difference_In_Days == 1) {
    return `${Difference_In_Days} day`;
  } else {
    return `${Difference_In_Days} days`;
  }
}





async function loadImg() {
  const serialApi = `https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/${tokenID}/nfts/${serialNumber}`;

  const serialRes = fetch(serialApi)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  let serialInfo = await serialRes;

let imgMeta = serialInfo.metadata;

let imgDec = atob(imgMeta)
//let lower = imgDec



const metaApi = `https://dweb.link/ipfs/${imgDec}/`;

  const metaRes = fetch(metaApi)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  let metaInfo = await metaRes;

  let imgLink =  metaInfo.image;
  imgLink = imgLink.substring(7)


  console.log(imgLink)


  let ipfsLink  = `https://dweb.link/ipfs/${imgLink}/`;

  document.getElementById("nft").src=`${ipfsLink}`;


  document.getElementById("nftdiv").style.display = "block";
  document.getElementById("loader").style.display = "none";
   
 







  } 





//document.getElementById("nft").src="https://hodlhow.com/wp-content/uploads/2022/09/Ledger-Nano-X-1.jpg.webp";
async function main() {






  const api = `https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/${tokenID}/nfts/${serialNumber}/transactions?limit=1000`;
  let fullPath = "";

  const apiRes = fetch(api)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  let obj = await apiRes;

  const apiInfo = `https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/${tokenID}`;

  const infoRes = fetch(apiInfo)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  let tokenInfo = await infoRes;

  console.log(obj["transactions"]);
  async function makePath(_obj) {
    //console.log(obj);
    let firstDate = "";
    let lastDate = formatDate(Date.now());

    //LOOP THRU TRANSACTIONS
    for (let i = _obj["transactions"].length - 1; i >= 0; i--) {
      // IF TRANSACTION = TOKEN MINT
      if (i == _obj["transactions"].length - 1) {
        fullPath += `${tokenInfo.name} (${tokenID}) #${serialNumber} was created by ${_obj["transactions"][i].receiver_account_id}`;

        const timeStamp = _obj["transactions"][i].consensus_timestamp;
        const apiPrice = `https://mainnet-public.mirrornode.hedera.com/api/v1/transactions?timestamp=${timeStamp}`;
        console.log(timeStamp);

        const apiRes2 = fetch(apiPrice)
          .then((response) => response.json())
          .then((data) => {
            return data;
          });
        let obj2 = await apiRes2;
        //console.log(obj2.transactions[0].transfers);
        let receiverAcc = _obj["transactions"][i].receiver_account_id;
        console.log(receiverAcc);
        let date = _obj["transactions"][i].consensus_timestamp * 1000;
        firstDate = formatDate(
          _obj["transactions"][i].consensus_timestamp * 1000
        );
        console.log(obj2);
        console.log(obj2.transactions[0].transfers);
        let j = 0;
        //GET PRICE
        for (let i = 0; i < obj2.transactions[0].transfers.length; i++) {
          if (obj2.transactions[0].transfers[i].account == receiverAcc) {
            fullPath += ` with a mint fee of ~${Math.abs(
              Math.floor(obj2.transactions[0].transfers[i].amount / -100000000)
            )}HBAR on ${formatDate(date)},<br><br> `;

            document.getElementById("demo").innerHTML = fullPath;

            j++;
          }
        }
        if (j <= 0) {
          fullPath += ` on ${formatDate(date)},<br> `;

          document.getElementById("demo").innerHTML = fullPath;

          j++;
        }
      }

      // IF LOOP IS NOT 0
      else if (i !== 0) {
        const timeStamp = _obj["transactions"][i].consensus_timestamp;
        const apiPrice = `https://mainnet-public.mirrornode.hedera.com/api/v1/transactions?timestamp=${timeStamp}`;

        const apiRes2 = fetch(apiPrice)
          .then((response) => response.json())
          .then((data) => {
            return data;
          });
        let obj2 = await apiRes2;
        //console.log(obj2.transactions[0].transfers);

        let receiverAcc = _obj["transactions"][i].receiver_account_id;

        let date = _obj["transactions"][i].consensus_timestamp * 1000;

        let j = 0;
        for (let i = 0; i < obj2.transactions[0].transfers.length; i++) {
          if (
            obj2.transactions[0].transfers[i].account == receiverAcc &&
            obj2.transactions[0].transfers[i].amount / -100000000 >= 1
          ) {
            fullPath += `then was sold for ${Math.abs(
              Math.floor(obj2.transactions[0].transfers[i].amount / -100000000)
            )}HBAR on ${formatDate(date)},<br> `;
            totalVol += Math.abs(
              Math.floor(obj2.transactions[0].transfers[i].amount / -100000000)
            );
            document.getElementById("demo").innerHTML = fullPath;
          }
        }
        if (j <= 0) {
          fullPath += `then sent to ${receiverAcc} on ${formatDate(
            date
          )},<br> `;

          document.getElementById("demo").innerHTML = fullPath;

          j++;
        }
      } else if (i == 0) {
        const timeStamp = _obj["transactions"][i].consensus_timestamp;
        const apiPrice = `https://mainnet-public.mirrornode.hedera.com/api/v1/transactions?timestamp=${timeStamp}`;

        const apiRes2 = fetch(apiPrice)
          .then((response) => response.json())
          .then((data) => {
            return data;
          });
        let obj2 = await apiRes2;
        //console.log(obj2.transactions[0].transfers)
        let receiverAcc = _obj["transactions"][i].receiver_account_id;
        let date = _obj["transactions"][i].consensus_timestamp * 1000;
        //console.log(obj2.transactions[0].transfers.length)
        // console.log(receiverAcc)
        let j = 0;

        for (let i = 0; i < obj2.transactions[0].transfers.length; i++) {
          if (
            obj2.transactions[0].transfers[i].account == receiverAcc &&
            obj2.transactions[0].transfers[i].amount / -100000000 >= 1
          ) {
            fullPath += `then was finally sold to ${receiverAcc}`;
            fullPath += ` for ${Math.abs(
              Math.floor(obj2.transactions[0].transfers[i].amount / -100000000)
            )}HBAR on ${formatDate(date)}, `;
            document.getElementById("demo").innerHTML = fullPath;
            totalVol += Math.abs(
              Math.floor(obj2.transactions[0].transfers[i].amount / -100000000)
            );
            j++;
          }
        }
        if (j <= 0) {
          fullPath += `then was finally sent to ${receiverAcc} on ${formatDate(
            date
          )},`;
          document.getElementById("demo").innerHTML = fullPath;
          j++;
        }

        fullPath += ` where it's currently held.`;
        fullPath += `<br><br>Total trading volume is ${totalVol}HBAR over the last ${getDays(
          firstDate,
          lastDate
        )} since mint.`;
      }
      document.getElementById("demo").innerHTML = fullPath;
    }

    console.log(fullPath);

    let soldBefore = "sold";
    let soldAfter = soldBefore.fontcolor("#00ffaa");
    let sentBefore = "sent";
    let sentAfter = sentBefore.fontcolor("#f5e768");
    let hBefore = "HBAR";
    let hAfter = hBefore.fontcolor("#00ffaa");

    document.getElementById("demo").innerHTML = fullPath;
    document.body.innerHTML = document.body.innerHTML.replace(
      new RegExp(soldBefore, "g"),
      soldAfter
    );
    document.body.innerHTML = document.body.innerHTML.replace(
      new RegExp(sentBefore, "g"),
      sentAfter
    );
    document.body.innerHTML = document.body.innerHTML.replace(
      new RegExp(hBefore, "g"),
      hAfter
    );
  }
  makePath(obj);
}
main(tokenID, serialNumber);
loadImg()
