const express = require('express');
const router = express.Router()


router.post("/list-users", (req, res) => { 
    let obj = req.body.users;
    let someArr = [];

    // Potential DoS if obj.length is large.
    for (let i = 0; i < obj.length; i++) { 
        someArr.push(obj[i]);
    } 

    //doing something with the code
    res.send(someArr.join(','));
});


module.exports = router
