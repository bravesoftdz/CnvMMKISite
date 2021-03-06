'use strict';
const interval = 30000;
let dynCnv = {
    url: 'http://10.14.14.250:8081/dyncnv',
    realUrl: 'http://10.14.14.250:8081/dyncnv',
    localUrl: './json/dyncnv.json',
    cnv: document.querySelector('.cnv'),
    row: document.querySelector('#content-row'),
    rowCashe: document.querySelector('#content-row').cloneNode(true),
    btn: document.querySelector(' #cnv-btn'),
    errCount: 0,
};
let spinner = document.querySelector(' #spinner');
let timerIdCnv;
/////////////////////////////////////////////
let dynMnlz = {
    url: 'http://10.14.14.250:8081/dynmnlz',
    realUrl: 'http://10.14.14.250:8081/dynmnlz',
    localUrl: './json/dynmnlz.json',
    mnlz: document.querySelector('.mnlz'),
    row: document.querySelector('#content-row'),
    currentNode: document.querySelector('.mnlz'),
    btn: document.querySelector(' #mnlz-btn'),
    rowCashe: document.querySelector('#content-row').cloneNode(true),
    errCount: 0,
};
let timerIdMnlz;
/////////////////////////////////////////////////////////

let him = {
    url: 'http://10.14.14.250:8081/him?',
    realUrl: 'http://10.14.14.250:8081/him?',
    localUrl: './json/him.json',
    prob: document.querySelector('.prob'),
    row: document.querySelector('#content-row'),
    currentNode: document.querySelector('.prob'),
    him: document.querySelector('.him'),
    btn: document.querySelector(' #him-btn'),
    pair: document.querySelector(` .pair`),
    btns: document.querySelector(` #prev-next-btns`),
    probscount: 10,
    params: {
        rowStart: 0,
        rowEnd: 10,
        type: "All",
        days: 0,
        npl: 0,
    },
    errCount: 0,
    form: document.querySelector(` #him__form`),

};




showCnv(1);
// showMnlz(true);

dynMnlz.btn.addEventListener('click', mnlzClick);

dynCnv.btn.addEventListener('click', cnvClick);

him.btn.addEventListener('click', himClick);

him.btn.addEventListener('click', himClick);

him.form.querySelector('#him__npl').addEventListener('keydown', e => inputKeyPress(e));

document.querySelector(` main`).addEventListener('click', e => mainClick(e));



function inputKeyPress(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        filterHim();
    }
};

function mainClick(e) {
    if (e.target.classList.contains('next')) {
        nextPageHim();
    }
    ;
    if (e.target.classList.contains('prev')) {
        prevPageHim();
    }
    ;
    if (e.target.getAttribute('id') === 'him__filter') {
        filterHim();
    }
    ;
    if (e.target.getAttribute('id') === 'him__clear') {
        clearFilterHim();
    }
    ;
};


//////////////////////////////////////////////////////////////
////////////////////Events////////////////////////////////////



function himClick() {
    showMnlz(0);
    showCnv(0);
    showHim(1);
}

function cnvClick() {
    showMnlz(0);
    showCnv(1);
    showHim(0);
}

function mnlzClick() {
    showCnv(0);
    showMnlz(1);
    showHim(0);
}

function clearFilterHim() {
    him.params.rowStart = 0;
    him.params.rowEnd = 10;
    him.form.querySelector('#him__type').value = 'All';
    him.form.querySelector('#him__dt').value = '';
    him.url = him.realUrl;
    getHim();
}


function filterHim() {
    him.params.rowStart = 0;
    him.params.rowEnd = 10;

    him.params.type = him.form.querySelector('#him__type').value;

    const dt = him.form.querySelector('#him__dt').value;
    if (dt) {
        him.params.days = Math.floor(((new Date()) - (new Date(dt))) / 86400000);
    } else him.params.days = 0;

    const plInput = him.form.querySelector('#him__npl');
    const npl = plInput.value;
    if ((npl < 100000 || npl >= 400000) & (npl !== '')) {
        him.params.npl = 0;
        if (!plInput.classList.contains('warning'))
            plInput.classList.add('warning');
    } else {
        him.params.npl = npl;
        if (plInput.classList.contains('warning'))
            plInput.classList.remove('warning');
    }

    him.url = him.realUrl + `type=${him.params.type}&days=${him.params.days}&npl=${him.params.npl}&`
    getHim();
}

function prevPageHim() {
    him.params.rowStart = Math.max(him.params.rowStart - him.probscount - 1, 0);
    him.params.rowEnd = Math.max(him.params.rowEnd - him.probscount - 1, him.probscount);
    const url = him.url;
    him.url = url + `rowstart=${him.params.rowStart}&rowend=${him.params.rowEnd}`;
    getHim();
    him.url = url;
}

function nextPageHim() {
    him.params.rowStart += him.probscount + 1;
    him.params.rowEnd += him.probscount + 1;
    const url = him.url;
    him.url = url + `rowstart=${him.params.rowStart}&rowend=${him.params.rowEnd}`;
    getHim();
    him.url = url;
}


//////////////////////////////////////////////////////////////
////////////////////him////////////////////////////////////

function showHim(show) {
    $('.collapse').collapse('hide');

    if (show) {
        if (!him.btn.classList.contains("active")) {
            him.btn.classList.add("active");
            him.form.hidden = false;
            getHim();
        }
    }
    else {
        him.btn.classList.remove("active");
        him.form.hidden = true;
    }
};
function getHim() {
    spinner.hidden = false;
    him.rowCashe = him.row.cloneNode(true);
    him.him.hidden = false;
    him.btns.hidden = false;
    him.rowCashe.innerHTML = '';
    fetch(him.url)
        .then(res => {
            if (!res.ok) {
                him.url = him.localUrl;
                errHimCatching();
                return null;
            }
            else {
                him.errCount = 0;
                return res.json();
            }

        },
            err => {
                console.log(err);
                errHimCatching();
                return null;
            }
        )
        .then(json => {
            if (json)
                json.forEach((prob, i) => {
                    drawHimItem(i, prob);
                });
            him.rowCashe.append(him.btns);
            him.row.innerHTML = him.rowCashe.innerHTML;
            spinner.hidden = true;
        });

}
function errHimCatching() {
    him.url = him.localUrl;
    him.errCount++;
    if (him.errCount < 2)
        getHim();
    him.url = him.realUrl;
}

function drawHimItem(i, prob) {
    him.currentNode = him.prob.cloneNode(true);
    him.currentNode.innerHTML = '';
    for (const element in prob) {
        if (prob[element]) {
            let currentpair = him.pair.cloneNode(true);
            currentpair.querySelector(` .key`).textContent = element;
            currentpair.querySelector(` .value`).textContent = prob[element];
            him.currentNode.append(currentpair);
        }
    }

    him.rowCashe.append(him.currentNode);
}


//////////////////////////////////////////////////////////////
////////////////////cnv////////////////////////////////////


function drawCnvItem(i, json) {
    let currentNode = dynCnv.cnv.cloneNode(true);
    currentNode.querySelector(`.title`).textContent = `Конвертер ${i + 1}`;
    currentNode.querySelector(`.pl_num`).textContent = json[`PL_NUM`];
    currentNode.querySelector(`.name`).textContent = json[`name`];
    const src = './img/cnv/1.jpg';
    currentNode.querySelector('.code_oper').setAttribute('src', src.replace('1', json[`code_oper`]));
    currentNode.querySelector('.code_oper').setAttribute('alt', json[`name`]);
    dynCnv.rowCashe.append(currentNode);
};
function getCnvDyn() {
    spinner.hidden = false;
    dynCnv.rowCashe = dynCnv.row.cloneNode(true);
    dynCnv.cnv.hidden = false;
    dynCnv.rowCashe.innerHTML = '';
    fetch(dynCnv.url)
        .then(res => {
            if (!res.ok) {
                errCnvCatching();
                return null;
            }
            else {
                dynCnv.url = dynCnv.realUrl;
                dynCnv.errCount = 0;
                return res.json();
            }
        }, err => {
            console.log(err);
            errCnvCatching();
            return null;
        }
        )
        .then(json => {
            if (json)
                json.forEach((cnv, i) => {
                    drawCnvItem(i, cnv);
                })

            dynCnv.row.innerHTML = dynCnv.rowCashe.innerHTML;
            spinner.hidden = true;
        }
        );
};
function errCnvCatching() {
    dynCnv.url = dynCnv.localUrl;
    dynCnv.errCount++;
    if (dynCnv.errCount < 2)
        getCnvDyn();
}

function showCnv(show) {
    $('.collapse').collapse('hide');
    if (show) {
        if (!dynCnv.btn.classList.contains("active")) {
            dynCnv.btn.classList.add("active");
            getCnvDyn();
            timerIdCnv = setInterval(getCnvDyn, interval)
        }
    }
    else {
        dynCnv.btn.classList.remove("active");
        clearInterval(timerIdCnv);
    }

};

//////////////////////////////////////////////////////////////
////////////////////mnlz////////////////////////////////////

function getMnlzDyn() {
    spinner.hidden = false;
    dynMnlz.rowCashe = dynMnlz.row.cloneNode(true);
    dynMnlz.mnlz.hidden = false;
    dynMnlz.rowCashe.innerHTML = '';
    fetch(dynMnlz.url)
        .then(res => {
            if (!res.ok) {
                errMnlzCatching();
                return null;
            }
            else {
                dynMnlz.url = dynMnlz.realUrl;
                dynMnlz.errCount = 0;
                return res.json();
            }
        }, err => {
            console.log(err);
            errMnlzCatching();
            return null;
        }
        )
        .then(json => {
            if (json)
                json.forEach((mnlz, i) => {
                    drawMnlzItem(i, mnlz);
                });
            dynMnlz.row.innerHTML = dynMnlz.rowCashe.innerHTML;
            spinner.hidden = true;

        });

}
function errMnlzCatching() {
    dynMnlz.url = dynMnlz.localUrl;
    dynMnlz.errCount++;
    if (dynMnlz.errCount < 2)
        getMnlzDyn();
}

function drawMnlzItem(i, mnlz) {
    dynMnlz.currentNode = dynMnlz.mnlz.cloneNode(true);
    dynMnlz.currentNode.querySelector(` .title`).textContent = `МНЛЗ-${i + 1}`;
    let mnlzRow = dynMnlz.currentNode.querySelector('.row');
    mnlzRow.querySelector(` .num_pl`).textContent = mnlz.num_pl;
    delete mnlz.num_pl;
    let paramName = mnlzRow.querySelector(` .param-name`);
    let paramValue = mnlzRow.querySelector(` .param-value`);
    for (const param in mnlz) {
        paramName.textContent = param;
        paramValue.textContent = mnlz[param];
        mnlzRow.append(paramName);
        mnlzRow.append(paramValue);
        paramName = paramName.cloneNode(true);
        paramValue = paramValue.cloneNode(true);

    }
    dynMnlz.currentNode.append(mnlzRow);
    dynMnlz.rowCashe.append(dynMnlz.currentNode);
}


function showMnlz(show) {
    $('.collapse').collapse('hide');
    if (show) {
        if (!dynMnlz.btn.classList.contains("active")) {
            dynMnlz.btn.classList.add("active");
            getMnlzDyn();
            timerIdMnlz = setInterval(getMnlzDyn, interval);
        }
    }
    else {
        dynMnlz.btn.classList.remove("active");
        clearInterval(timerIdMnlz);
    }
};

