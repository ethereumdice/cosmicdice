"use strict";

function updateTables(sec) {

	setTimeout(function(){

		///////////////////Make tables of latest entrants and winners////////////////////////

		////// Get player data ///////////
		var xmlhttp = new XMLHttpRequest();
		var url = "https://api." + dataurl + "/api?module=account&action=txlist&address=" + gameaddress + "&startblock=0&endblock=999999999&page=1&offset=100&sort=desc&apikey=KXI17FJ1RIKHRQM543VY8ZDGWAJG5VGK7Y";

		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var myArr = JSON.parse(this.response);
				makePlayTable(myArr);
			}
		};
		
		xmlhttp.open("GET", url, true);
		xmlhttp.send();

		////// Make player table ///////////

		function makePlayTable(arr) {

			var k;
			var j = 0;
			var $gameaddress = gameaddress;

			//	Make player table headers
			var $txtable = $( "<table class='table table-striped table-hover'></table>" );
			var $line = $( "<tr class='txheader'></tr>" );
				$line.append( $( "<td></td>" ).html( "Time" ) );
				$line.append( $( "<td></td>" ).html( "Player" ) );
				$line.append( $( "<td></td>" ).html( "Bet" ) );
				$txtable.append( $line );
				
			//	Make table of players	
			
			for (k = 0 ; k < arr.result.length;) {
				
				if (arr.result[k].to = gameaddress && arr.result[k].value >= 10000000000000000 && j<10) {
					var $time = "<span data-livestamp=" + arr.result[k].timeStamp + "></span>";
					var $line = $( "<tr></tr>" );
					$line.append( $( "<td></td>" ).html( $time ) );		
					$line.append( $( "<td></td>" ).html( arr.result[k].from ) );
					$line.append( $( "<td></td>" ).html( arr.result[k].value/1000000000000000000 ) );		
					$txtable.append( $line );
					k++;
					j++;
				}
				
				else {
					k++;
				}
			}

			$("#latestentries").html($txtable);
		}

		////// Get winner data ////////////

		var xmlhttp2 = new XMLHttpRequest();
		var url2 = "https://api." + dataurl + "/api?module=account&action=txlistinternal&address=" + gameaddress + "&startblock=0&endblock=999999999&page=1&offset=100&sort=desc&apikey=KXI17FJ1RIKHRQM543VY8ZDGWAJG5VGK7Y";

		xmlhttp2.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var myArr2 = JSON.parse(this.response);
				makeWinTable(myArr2);
			}
		};
		xmlhttp2.open("GET", url2, true);
		xmlhttp2.send();

		/////// Make winner table ////////////

		function makeWinTable(arr2) {

			var k;
			var j = 0;
			var $gameaddress = gameaddress;

			//	Make winner table headers
			var $wintable = $( "<table class='table table-striped'></table>" );
			var $winline = $( "<tr class='txheader'></tr>" );
				$winline.append( $( "<td></td>" ).html( "Time" ) );
				$winline.append( $( "<td></td>" ).html( "Winner" ) );
				$winline.append( $( "<td></td>" ).html( "Payout" ) );
				$wintable.append( $winline );

			//	Make table of winners
			for (k = 0 ; k < arr2.result.length;) {
				
				if (arr2.result[k].from = gameaddress && arr2.result[k].value >= 15000000000000000 && j<10) {

					var $time = "<span data-livestamp=" + arr2.result[k].timeStamp + "></span>";
					var $winline = $( "<tr></tr>" );
					$winline.append( $( "<td></td>" ).html( $time ) );		
					$winline.append( $( "<td></td>" ).html( arr2.result[k].to ) );
					$winline.append( $( "<td></td>" ).html( arr2.result[k].value/1000000000000000000 ) );		
					$wintable.append( $winline );		
					k++;
					j++;
				}
				else {
					k++;
				}
			}

			$("#winnerlist").html($wintable);
		}
	}, sec);
}
