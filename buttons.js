"use strict";

//////// Bet buttons ////////////////////////

var buttonData;
var betAmount;
var inpID;
var nVal;
var luckynum;
var butt;


// Button function
function buttonFunc(buttonID) {

    buttonData = document.getElementById(buttonID);
    betAmount = parseFloat(buttonData.value);
    inpID = buttonData.dataset.inpid;
    nVal = parseFloat(buttonData.dataset.nval);
    luckynum = parseFloat(document.getElementById(inpID).value);
    var x = web3Validate();
    var y = numValidate(luckynum, nVal);
    var z = playCheck(y);
    
    if(x==true && y==true && z==false) {
        getRandNum();
        const cdConInst = createContract();
        cdConInst.play(luckynum, trn, nVal, {from: web3.eth.coinbase, value:web3.toWei(betAmount,'ether')}, function(err, txHash){
            if(!err) {
                showResult(err, txHash, nVal);
            }
        });
    }
}


// Check to make sure user entered a valid number
function numValidate(luckynum, nVal) {
	
	var text;
    var x = luckynum;
    if (isNaN(x) || x < 1 || x > nVal) {
		text = "Please enter a number between 1 and " + nVal;
		alert(text);
		return false;
	}
	else {
		return true;
	}
}

// Check for web3
function web3Validate() {
	
	if (typeof web3 == 'undefined') {
		alert("This website requires a web3 enabled browser. Metamask is the simplest solution: https://metamask.io. Or try installing Ethereum Mist https://github.com/ethereum/mist.");
		return false;
	}
	else {
		return true;
	}
}

// Check if unfinished play in progress
function playCheck(y) {
    if (playFlag==1 && y==true) {
        alert("Please wait for your current play to finish.");
        return true;
    }
    else {
        return false;
    }
}

// Enable/disable buttons according to contract balance
function buttonStatus() {
    
    var z = setInterval(function() {

        butt = document.getElementsByClassName("btn-play");

        for (var p=0; p<butt.length; p++) {
            if (parseFloat(butt[p].dataset.nval)*0.5*parseFloat(butt[p].value) >= balance) {
                butt[p].disabled = "true";
            }
        }
        clearInterval(z);
    }, 1000);
}


