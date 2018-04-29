"use strict";

var txhID = [];
var playPendingID = [];
var playResultID = [];
var myBarID = [];
var myProgressID = [];
var resultBoxID = []
var resultTextID = [];
var playHash = [];
var pretxhID = [];
var i = 0;
var playFlag = 0;


/////////////////// Display user details /////////////////////////////////////////////

/*
function showUserAdd() {
	if(coinbase) {
		document.getElementById("coinbase").innerHTML = "My address: " + coinbase;
	}
}

function showUserBal() {
	var v = setInterval(function() {
		getUserBal();
		if(userBal) {
			document.getElementById("userBal").innerHTML = "My balance: " + userBal;
			clearInterval(v);
		}
	}, 1000);
}
*/

/////////////////// Show play status until final result available //////////////////////

function showResult(err, txHash, nVal){
	if(txHash) {
		i++;
		playHash[i] = txHash;
		txhID[i] = "txh" + nVal;
		playPendingID[i] = "playPending" + nVal;
		playResultID[i] = "playResult" + nVal;
		myBarID[i] = "myBar" + nVal;
		myProgressID[i] = "myProgress" + nVal;
		resultBoxID[i] = "resultBox" + nVal;
		resultTextID[i] = "resultText" + nVal;
		pretxhID[i] = "pretxh" + nVal;

		// Immediately display transaction hash
		document.getElementById(pretxhID[i]).innerText = "TxHash: ";
		document.getElementById(txhID[i]).href = "https://" + dataurl + "/tx/" + playHash[i];
		document.getElementById(txhID[i]).innerText = playHash[i];

		document.getElementById(playResultID[i]).innerText = "";
		document.getElementById(resultTextID[i]).innerText = "";
		document.getElementById(resultBoxID[i]).className = "resultBox";
		document.getElementById(playPendingID[i]).innerText = "Transaction being mined, please wait...";
		
		//check transaction status every 1 second(s) until no longer pending. then run playResWatch
		var width = 0; //progress bar
		var elem = document.getElementById(myBarID[i]); //progress bar
		var elem1 = document.getElementById(myProgressID[i]); //progress bar
		elem.style.width = width + '%';
		elem.style.visibility = 'visible';
		elem1.style.visibility = 'visible';

		var a = [];
		a[i] = setInterval(function(){
			
			playFlag = 1; // For checking if game in progress
			web3.eth.getTransactionReceipt(playHash[i], function(error,result){
				if(!error){
					if (result == null) {
						//console.log(result);
						
						//progress bar
						if (width >= 100) {
							width = 0;
							elem.style.width = width + '%';
						} else {
							width = width + 5; 
							elem.style.width = width + '%';
						}
					}
					else {
						document.getElementById(playPendingID[i]).innerText = "Getting your result...";
						//console.log(result);
						elem.style.visibility = 'hidden';
						elem1.style.visibility = 'hidden';
						playResWatch(playHash[i], playResultID[i]);
						clearInterval(a[i]);
					}
				}
				else{
					console.log(error);
				}
				
			});
		}, 1000);

	} else {
		alert("showResult: "+err);
	}
}

///////////////////// Print final play result ////////////////////////////////////////////

function playResult(err, playres, txHash, playResID){
	
	playHash[i] = txHash;
	playResultID[i] = playResID;
	if(playres) {
		if(playres.args.result=="Congratulations, you win!") {
			document.getElementById(resultBoxID[i]).classList.add('winResult');
		}
		else {
			document.getElementById(resultBoxID[i]).classList.add('loseResult');
		}
		document.getElementById(playPendingID[i]).innerText = "";
		
		//document.getElementById(playResultID[i]).innerText = playres.args.result + " You guessed " + playres.args.ln + " and the random number generated was " + playres.args.crn + ".";
		document.getElementById(playResultID[i]).innerText = playres.args.crn;
		document.getElementById(resultTextID[i]).innerText = playres.args.result;
		getBal(); // Update contract balance
		buttonStatus();
		updateTables(5000);
		playFlag = 0; // Game no longer in progress
		
	} else {
		alert("showResult: "+err);
	}
}

//////////////////// Watch for contract events ////////////////////////////////////

function playResWatch(txHash, playResID){
	playHash[i] = txHash;
	playResultID[i] = playResID;
	var cdConInst = [];
	cdConInst[i] = createContract();
	var playRes = [];
	playRes[i] = cdConInst[i].message({transactionHash:txHash}); //txHash filter not working
	playRes[i].watch(function(err, playres){
		if(playres.transactionHash == playHash[i]) {
			playResult(err, playres, playHash[i], playResultID[i]);
			playRes[i].stopWatching();
		}
	});
}

/////// Get random number from random.org////////

var trn;

function getRandNum() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		trn = parseInt(JSON.parse(this.responseText).result.random.data[0]);
	  }
	};
	xhttp.open("POST", "https://api.random.org/json-rpc/1/invoke", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send('{"jsonrpc":"2.0","method":"generateIntegers","params":{"apiKey":"23e6d01d-155a-4688-ad3a-e5dae33c54a8","n":10,"min":1,"max":10},"id":1578}');
}


///////////// Get contract balance and adjust button active state ///////////////////
/*
var cdCon = createContract();

var bal = cdCon.getBalance;
*/
