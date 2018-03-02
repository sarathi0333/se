const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/search', (req, res, next) => {
    var dir = req.body.dir;
    var lastChar = dir[dir.length - 1];
    if (lastChar == "\\") {
        lastChar.slice(-1);
    }

    fs.readdir(req.body.dir, (err, files) => {
        var docFile = [];
        var otherFiles = [];
        files.forEach((file) => {
            if (path.extname(file) == '.doc' || path.extname(file) == '.docx')
                docFile.push(file)
            else
                otherFiles.push(file);
        })
        res.json({ "docFile": docFile, "otherFiles": otherFiles });
    })
});

app.post('/api/file', (req, res, next) => {
    var files = req.body.files;
    var skill = req.body.skill;
    var dir = req.body.dir;
    var lastChar = dir[dir.length - 1];
    if (lastChar == "\\") {
        lastChar.slice(-1);
    }

    fs.readFile(dir, (err, data) => {
        if (err) throw err;
        console.log(data)
        res.json('hello');
    })

});

app.use('/', express.static('public'))
const _port = 3000;
app.listen(_port, () => console.log(`server running in port ${_port}`));
