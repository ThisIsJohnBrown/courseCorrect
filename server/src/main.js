var currStates = [{"min":8,"max":58,"curr":58},{"min":14,"max":64,"curr":64},{"min":9,"max":58,"curr":58},{"min":5,"max":64,"curr":64},{"min":10,"max":63,"curr":63},{"min":19,"max":66,"curr":66},{"min":20,"max":71,"curr":71},{"min":0,"max":43,"curr":43},{"min":12,"max":52,"curr":52},{"min":10,"max":61,"curr":61},{"min":7,"max":55,"curr":55},{"min":11,"max":62,"curr":62},{"min":3,"max":53,"curr":53},{"min":4,"max":58,"curr":58},{"min":8,"max":62,"curr":62},{"min":8,"max":65,"curr":65}];

let teeGroup = document.getElementsByClassName('tee-group')[0];

for (var i = 0; i < 15; i++) {
    var g = teeGroup.cloneNode(true);
    g.setAttribute('data-index', i + 1);
    document.body.appendChild(g);
}

document.getElementsByClassName('js-go-min-global')[0].onclick = goToMinGlobal;
document.getElementsByClassName('js-go-max-global')[0].onclick = goToMaxGlobal;

let buttons = document.getElementsByClassName('js-go-min');
for (var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = goToMin;
}
buttons = document.getElementsByClassName('js-go-max');
for (var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = goToMax;
}

function goToMin() {
    var i = parseInt(this.parentNode.parentNode.dataset['index'], 10);
    currStates[i].curr = currStates[i].min;
    setCurr();
    sendCurr();
}

function goToMax() {
    var i = parseInt(this.parentNode.parentNode.dataset['index'], 10);
    currStates[i].curr = currStates[i].max;
    setCurr();
    sendCurr();
}

function goToMinGlobal() {
    let teeGroups = document.getElementsByClassName('tee-group');
    for (var i = 0; i < teeGroups.length; i++) {
        currStates[i].curr = currStates[i].min;
        teeGroups[i].getElementsByClassName('js-slider')[0].value = currStates[i].curr;
        teeGroups[i].getElementsByClassName('curr-value')[0].innerHTML = currStates[i].curr;
    }
    sendCurr();
}

function goToMaxGlobal() {
    let teeGroups = document.getElementsByClassName('tee-group');
    for (var i = 0; i < teeGroups.length; i++) {
        currStates[i].curr = currStates[i].max;
        teeGroups[i].getElementsByClassName('js-slider')[0].value = currStates[i].curr;
        teeGroups[i].getElementsByClassName('curr-value')[0].innerHTML = currStates[i].curr;
    }
    sendCurr();
}

function changeRange(range) {
    range.parentNode.getElementsByClassName('curr-value')[0].innerHTML = range.value;
    sendCurr();
}

function sendCurr() {
    let teeGroups = document.getElementsByClassName('tee-group');
    for (var i = 0; i < teeGroups.length; i++) {
        currStates[i].curr = parseInt(teeGroups[i].getElementsByClassName('js-slider')[0].value, 10);
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/update", true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    // send the collected data as JSON
    xhr.send(JSON.stringify(currStates));
}

function setCurr() {
    let teeGroups = document.getElementsByClassName('tee-group');
    for (var i = 0; i < teeGroups.length; i++) {
        teeGroups[i].getElementsByClassName('js-slider')[0].value = currStates[i].curr;
        teeGroups[i].getElementsByClassName('curr-value')[0].innerHTML = currStates[i].curr;
        // currStates[i].curr = newNum;
    }
}

setCurr();