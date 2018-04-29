pragma solidity ^0.4.0;

contract Mortal {
    /* Define variable owner of the type address*/
    address owner;

    /* this function is executed at initialization and sets the owner of the contract */
    function Mortal() { owner = msg.sender; }

    /* Function to recover the funds on the contract */
    function kill() { if (msg.sender == owner) selfdestruct(owner); }

    modifier onlyOwner {
      require(msg.sender == owner);
      _;
    }
}

import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

contract cosmicDice is usingOraclize, Mortal {
    
    uint constant minbet = 0.01 ether;
    uint constant maxbet = 1 ether;
    uint public totalPlayCount = 0;  //total game play count
    mapping(address => uint) public playerPlayCount; //player play count
    mapping(uint => address) public player; //player mapping
    mapping(address => uint) public ln;  //user chosen lucky number
    mapping(address => uint) public prn; //psuedo random number
    mapping(address => uint) public trn; //true random number
    mapping(address => uint) public crn; //combined random number
    mapping(address => uint) public payout; //payout calculated for each play
    mapping(address => uint) public nval; //max n value
    mapping(address => uint) public multiplier; //multuplier for win payout
    uint public bl;  //another prn

    function cosmicDice() public payable {
        
    }
    
    function() public payable {
        
    }
    
    function deposit() public payable {
        
    }
    
    function withdraw(uint _withdrawAmount) public {
        
        require(msg.sender == owner);
        msg.sender.transfer(_withdrawAmount); //withdraw amount must be in Wei and inside double quotes so the javascript solidity browser can read it as a BigNumber
    }
    
    event message(string result, uint ln, uint crn);

    function play(uint _luckynum, uint _trueRand, uint _nval) payable {
        require(msg.value >= minbet && msg.value <= maxbet);
        require(_nval==2||_nval==6||_nval==10||_nval==20||_nval==50||_nval==100||_nval==500||_nval==1000);
        totalPlayCount ++; // index play count
        update();  // update the psuedo random number from wolfram alpha
        bl = uint(sha3(block.timestamp));
        player[totalPlayCount] = msg.sender;
        playerPlayCount[player[totalPlayCount]] ++; //index player play count
        if (_nval == 2) {
            multiplier[player[totalPlayCount]] = (300*_nval)/4;
        }
        else {
            multiplier[player[totalPlayCount]] = 100*_nval/2;
        }
        nval[player[totalPlayCount]] = _nval;
        payout[player[totalPlayCount]] = (msg.value * multiplier[player[totalPlayCount]])/100; // set the payout multiplier
        ln[player[totalPlayCount]] = _luckynum;
        trn[player[totalPlayCount]] = _trueRand;
        prn[player[totalPlayCount]] = randnum;
        crn[player[totalPlayCount]] = ((trn[player[totalPlayCount]] + prn[player[totalPlayCount]] + bl) % nval[player[totalPlayCount]]) + 1;
        compareNums();
    }

    function compareNums() private {
        if (ln[player[totalPlayCount]] == crn[player[totalPlayCount]]) {
            //return true;
            emit message("Congratulations, you win!", ln[player[totalPlayCount]], crn[player[totalPlayCount]]);
            player[totalPlayCount].transfer(payout[player[totalPlayCount]]);
            payout[player[totalPlayCount]] = 0;
        }
        else {
            //return false;
            emit message("Sorry, try again.", ln[player[totalPlayCount]], crn[player[totalPlayCount]]);
        }
    }

/// Begin oraclize

    uint public randnum;
    uint public gasPrice;

    event newOraclizeQuery(string description);
    event newRandNum(string rnum);
    
    function setCustomGasPrice(uint _gasPrice) public payable{
        require(msg.sender == owner);
        gasPrice = _gasPrice;
        oraclize_setCustomGasPrice(gasPrice); // testing
    }

    function __callback(bytes32 myid, string result) {
        if (msg.sender != oraclize_cbAddress()) revert();
        emit newRandNum(result);
        randnum = parseInt(result);
    }
    
    function update() payable {
        emit newOraclizeQuery("Oraclize query was sent, standing by for the answer..");
//        oraclize_query("URL", "json(https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint8).data[0]");
        oraclize_query("WolframAlpha", "random number between 1 and 10");
    }

}