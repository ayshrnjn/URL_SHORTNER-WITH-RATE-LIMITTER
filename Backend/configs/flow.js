fileUpload().then((url)=>{
    return shortenUrl(url);
    }).sendMail(()=>{
        return sendMail(url,emailData);
    });