const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";
// const OriginalBASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/inr.json";


let dropdowns = document.querySelectorAll('.dropdown select');
let img = document.querySelectorAll('.dropdown img');
let input = document.querySelector('.form input');
let btn = document.querySelector('form button');
let fromcur = document.querySelector('.from select');
let tocur = document.querySelector('.to select');
let msg = document.querySelector('.msg')

for (let sel of dropdowns) {
    for (let curcode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = curcode;
        newOption.value = curcode;
        sel.append(newOption);
        if (sel.name === 'from' && curcode === 'USD') {
            newOption.selected = 'selected'
        } if (sel.name === 'to' && curcode === 'INR') {
            newOption.selected = 'selected'
        }
    }
    sel.addEventListener('change', (evt) => {
        changeFlag(evt.target);
    })
}

const changeFlag = (s) => {
    let curcode = s.value;
    let countryCode = countryList[curcode];
    let newsrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = s.parentElement.querySelector('img');
    img.src = newsrc;
}


const updtExngRate = async () => {
    let inputAmt = input.value
    if (inputAmt === "" || inputAmt < 1) {
        inputAmt = 1;
        input.value = '1';
    }

    const URL = `${BASE_URL}/${fromcur.value.toLowerCase()}/${tocur.value.toLowerCase()}.json`
    let response = await fetch(URL)
    let data = await response.json()
    let rate = data[tocur.value.toLowerCase()]
    let finalAmount = inputAmt * rate
    console.log(finalAmount);
    msg.innerText = `${inputAmt}${fromcur.value} = ${finalAmount} ${tocur.value}`
}

btn.addEventListener('click', (e) => {
    e.preventDefault()
    updtExngRate()
})



