document.getElementById("score_section").style.display = "None";

var NebPay = require("nebpay");
var nebPay = new NebPay();

var contractAddress = "n1ormX2Zv2gFb6MTB3i6TFuncWeUSjrDdR2";

window.addEventListener("load", check_neb);

function check_neb() {

    if (typeof (webExtensionWallet) == "undefined") {


        if (window.confirm('You dont have the Chrome web wallet extension installed to use this Dapp click Confirm to download now ')) {
            window.location.href = 'https://github.com/ChengOrangeJu/WebExtensionWallet';
        }

    } else {
        console.log("It is present");
    }

    get_highest();

}


function get_highest() {
    var args = "[]";
    nebPay.simulateCall(contractAddress, 0, "get", args, {
        listener: result
    });
}

// window.addEventListener("message",function(data){
//     alert(JSON.stringify(data));
// })

function result(data) {

    var result = JSON.parse(data.result);

    if (result) {
        document.getElementById("score_section").style.display = "block";
        document.getElementById("high_score").innerHTML = "High Score:   " + result.score + "  by " + result.name;
    } else {
        document.getElementById("high_score").innerHTML = "High Score: 0 ";
    }

}





gamelength = 20;
timerID = null
var username;
var quote;
var playing = false;
var numholes = 7 * 10;
var currentpos = -1;
function clrholes() {
    for (var k = 0; k < document.dmz.elements.length; k++)
        document.dmz.elements[k].checked = false;
}
function stoptimer() {
    if (playing)
        clearTimeout(timerID);
}
function showtime(remtime) {
    document.cpanel.timeleft.value = remtime;
    if (playing) {
        if (remtime == 0) {
            stopgame();
            return;
        }
        else {
            temp = remtime - 1;
            timerID = setTimeout("showtime(temp)", 1000);
        }
    }
}


function submit_score() {

    console.log("Add to the Smart Contract");
    var func = "save"
    var args = "[\"" + username + "\",\"" + quote + "\"]";

    nebPay.simulateCall(contractAddress, 0, func, args, {
        listener: cbCallDapp
    });

}


function final_submit(){

    console.log("Add to the Smart Contract");
    var func = "save"
    var args = "[\"" + username + "\",\"" + quote + "\"]";

    nebPay.call(contractAddress, 0, func, args, {
        listener: cbCallDapp
    });

}



function call_submit() {
    if (document.getElementById("player_name").value.trim()) {
        username = document.getElementById("player_name").value.trim();
        submit_score();
        $('#myModal').modal('hide');
    }
    else {
        alert("Your name is needed for submission");
    }
}


function stopgame() {
    stoptimer();
    playing = false;
    document.cpanel.timeleft.value = 0;
    clrholes();
    display("Game Over");
    //alert('Game Over.\nYour score is:  ' + totalhits);

    document.getElementById("player_score").innerHTML = "Your score is: " + totalhits;
    //username = document.getElementById("username").value
    quote = totalhits;
    // username = username.toLowerCase()

    $('#myModal').modal('show');



    // window.postMessage({
    //     "target": "contentscript",
    //     "data": {
    //         "to": contractAddress,
    //         "value": "0",
    //         "contract": {
    //             "function": func,
    //             "args": args
    //         }
    //     },
    //     "method": "neb_sendTransaction"
    // }, "*");


}

function cbCallDapp(result) {
    console.log("error came");
    if (result.result.indexOf("Error:") != -1) {
        //       alert("error");
        alert(result.result.split("Error:")[1]);
    } else {

        final_submit();
    }
}

function play() {

    //username = window.prompt("Enter your Name");
    $('#myModal').modal('hide');
    stoptimer();

    playing = true;
    clrholes();
    totalhits = 0;
    document.cpanel.score.value = totalhits;
    display("Playing");
    launch();
    showtime(gamelength);
}
function display(msg) {
    document.getElementById("game_status").innerHTML = msg;
    document.getElementById("game_status").style.color = "green";
}
function launch() {
    var launched = false;
    while (!launched) {
        mynum = random();
        if (mynum != currentpos) {
            document.dmz.elements[mynum].checked = true;
            currentpos = mynum;
            launched = true;
        }
    }
}

function touchhole(id) {
    if (playing == false) {
        clrholes();
        display("Click Start Game Button to Play");
        return;
    }
    if (currentpos != id) {
        totalhits += -1;
        document.cpanel.score.value = totalhits;
        document.dmz.elements[id].checked = false;
    }
    else {
        totalhits += 1;
        document.cpanel.score.value = totalhits;
        launch();
        document.dmz.elements[id].checked = false;
    }
}

function random() {
    return (Math.floor(Math.random() * 100 % numholes));
}
