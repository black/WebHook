const express = require("express")
const bodyParser = require("body-parser")
const fetch = require('node-fetch')
const app = express()
const PORT = 3000

let urls = [];

app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        var headers = {};
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        res.writeHead(200, headers);
        res.end();
    } else {
        next();
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

// add url to url array
app.post('/addURL', (req, res) => {
    console.log("URL", req.body.data);
    if (req.body.data.length>0) {
        urls.push(req.body.data);
    }
    res.status(200).send({
        data:urls,
        msg: "Successfully Added"
    });
});

// get all urls registered for hook
app.get('/allURL', (req, res) => {
    res.status(200).send({
        data:urls,
        msg: "Successfully Added"
    });
});

// update status
app.post("/updateStatus", (req, res) => {
    if (urls.length > 0) {
        updateURLStatus(req.body.data,res);
    } else {
        res.status(200).send({
            msg: 'no url in the list'
        });
    }
});

// update status to these urls
function updateURLStatus(status,res) {
    urls.forEach((val, idx) =>{ 
            fetch(val, { 
                    method: 'POST',
                    body: JSON.stringify({
                        "status": status
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).then(data => data.json())
                .then(json => { 
                    res.status(200).send({
                        status: json,
                        msg: 'successful'
                    });
                });
        });
}