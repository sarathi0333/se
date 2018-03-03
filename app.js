const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const WordExtractor = require("word-extractor");
var extractor = new WordExtractor();

var matchedFiles =[];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/search', (req, res, next) => {
    var dir = req.body.dir;
    var lastChar = dir[dir.length - 1];
    if (lastChar == "\\") {
        dir = dir.slice(0, -1);
    }

    fs.readdir(dir, (err, files) => {
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
    var file = req.body.file;
    var skill = req.body.skill;
    var dir = req.body.dir;
    var lastChar = dir[dir.length - 1];
    if (lastChar == "\\") {
        dir = dir.slice(0, -1);
    }
    var extracted = extractor.extract(dir+'/'+file);
    extracted.then(function(doc) {
       search(doc.getBody(), file, skill,(file, obj) => {
        res.status(200).json(obj);
       })
      });
});

function search (data, file, skill, callback) {
    var angular1 = /angular(\s?js|\s?1\.[4-6x])?/i;
    var react = /react(\s?js|.)/i;
    if(skill === 'angular1') {
        let res = angular1.test(data);
        if(res) {
            callback(file, {"msg":`${file} searched tech stack available`, "tech": "angular"});
        }
        else {
            callback(file, {"msg":`${file} searched tech not available available`, "tech": ""});
        }
    } else if(skill === 'angular2') {

    } else if(skill === 'react') {
        let res = react.test(data);
        if(res) {
            callback(file, {"msg":`${file} searched tech stack available`, "tech": "react"});
        }
        else {
            callback(file, {"msg":`${file} searched tech not available available`, "tech": ""});
        }
    }
    
}

app.use('/', express.static('public'));
const _port = 3000;
app.listen(_port, () => console.log(`server running in port ${_port}`));
