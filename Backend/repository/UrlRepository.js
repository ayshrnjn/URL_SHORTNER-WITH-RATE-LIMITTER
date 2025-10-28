const Url = require('../models/Url');
const Counter = require('../models/Counter');

async function saveUrl(shortId, originalUrl, id) {
    const newUrl = new Url({ id: id, shortUrl: shortId, originalUrl: originalUrl });
    return await newUrl.save();
}

async function getUrlByShortId(shortId){
    return await Url.findOne({shortUrl:shortId});
}

async function incrementCount(urlDoc){
    urlDoc.clickCount++;
    return await urlDoc.save();
}

async function getNextId() {
    const counter = await Counter.getNextSequence('counter');
    return counter.seq;
}

module.exports={saveUrl,getUrlByShortId,incrementCount,getNextId};
