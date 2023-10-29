const puppeteer = require('puppeteer');
const fs = require('fs');

async function search() {
    const browser = await puppeteer.launch({ headless: 'new' }); //must launch browser
    const page = await browser.newPage(); //then create a page
    let url = `https://p.eagate.573.jp/game/ddr/ddra3/p/music/index.html?offset=0&filter=7&filtertype=0`
    let data = []
    let versions = ["DDR 1st", "DDR 2ndMIX", "DDR 3rdMIX", "DDR 4thMIX", "DDR 5thMIX", "DDRMAX", "DDRMAX2", "DDR EXTREME", "DDR SuperNOVA", "DDR SuperNOVA 2", "DDR X", "DDR X2", 
        "DDR X3 VS 2ndMIX", "DanceDanceRevolution (2013)", "DanceDnaceRevolution (2014)", "DanceDanceRevolution A", "DanceDanceRevolution A20", 
        "DanceDanceRevolution A20 PLUS", "DanceDanceRevolution A3"];
    for (let i = 0; i < 19; i++) {
        index = i;
        url = `https://p.eagate.573.jp/game/ddr/ddra3/p/music/index.html?offset=0&filter=7&filtertype=${i}`

        await page.goto(url); //url of cite of go to

        const stuff = await page.$$eval('#data_tbl .data', songs => songs.map((song) => ({
            version: "",
            image: song.querySelector('.jk img').src,
            title: song.querySelector('.music_tit').innerText,
            artist: song.querySelector('.artist_nam').innerText,
            beginner: song.querySelector('td.difficult.be').innerText, //get difficulties
            basic: song.querySelector('td.difficult.ba').innerText,
            difficult: song.querySelector('td.difficult.di').innerText,
            expert: song.querySelector('td.difficult.ex').innerText,
            challenge: song.querySelector('td.difficult.ch').innerText,
        }))
        );
        stuff.map((item) => {
            item.version = versions[i];
        })
        data.push(stuff);
    }
    fs.writeFile('songdata.json', JSON.stringify(data), (err) => {
        if (err) throw err;
        console.log("File saved");
    })
    await browser.close();
}

search();