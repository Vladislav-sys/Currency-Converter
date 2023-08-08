"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const s1 = new Select("select-1", { items: ["USD", "EUR", "GBP", "RUB", "AUD", "CAD", "INR", "CNY", "TRY"], isDrag: false });
const s2 = new Select("select-2", { items: ["USD", "EUR", "GBP", "RUB", "AUD", "CAD", "INR", "CNY", "TRY"], start: 1, isDrag: false });
let mp = {
    USD: 1.102487,
    EUR: 1,
    GBP: 0.864831,
    AUD: 1.674241,
    CAD: 1.475514,
    INR: 91.157752,
    CNY: 7.905166,
    TRY: 29.701773,
    RUB: 105.700974,
};


function convert(from, to, amount) {
    return Math.round(amount / mp[from] * mp[to] * 1000) / 1000;
}
const swapBtn = document.querySelector(".converter-swap-btn");
const exchangeBtn = document.querySelector(".converter-btn");
const input = document.querySelector(".converter-input");
const text1 = document.getElementById("select-1").querySelector(".select-text");
const text2 = document.getElementById("select-2").querySelector(".select-text");
const result = document.querySelector(".converter-result");
const url = "https://open.er-api.com/v6/latest/USD";
function updateMap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(url);
            const data = yield res.json();
            mp = data.rates;
        }
        catch (e) {
            console.log(e);
        }
    });
}
swapBtn.addEventListener("click", function () {
    const tmp = s1.curItem;
    s1.setItem(s2.curItem);
    s2.setItem(tmp);
});
function setExchange() {
    return __awaiter(this, void 0, void 0, function* () {
        exchangeBtn.disabled = true;
        result.textContent = "Calculating...";
        yield updateMap();
        exchangeBtn.disabled = false;
        const c1 = text1.textContent;
        const c2 = text2.textContent;
        const val = (input.value.length === 0) ? 0 : parseFloat(input.value.replace(",", "."));
        result.textContent = `${val} ${c1} = ${convert(c1, c2, val)} ${c2}`;
    });
}
exchangeBtn.addEventListener("click", setExchange);
let curVal = "1";
input.value = curVal;
input.addEventListener("input", function (e) {
    let val = input.value;
    if (val.length === 0) {
        curVal = val;
        return;
    }
    if (/^[0-9]+[.,]?[0-9]*$/.test(val)) {
        if (val.length > 20) {
            val = val.slice(0, 20);
            input.value = val;
        }
        curVal = val;
    }
    else {
        input.value = curVal;
    }
});
setExchange();
