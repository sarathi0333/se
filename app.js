const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const WordExtractor = require("word-extractor");
var extractor = new WordExtractor();

var matchedFiles =[];
var angFolder = false;
var recFolder = false;
var otherFiles = [];

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
       search(doc.getBody(), dir, file, skill,(file, obj) => {
        res.status(200).json(obj);
       })
      });
});

function search (data, dir, file, skill, callback) {
    var angular1 = /angular(\s?js|\s?1\.[4-6x])?/i;
    var react = /react(\s?js|.)/i;
    if(skill === 'angular1') {
        let res = angular1.test(data);
        otherFiles.forEach((item) => {
            if(item == 'Angular')
                angFolder = true;
        })
        if(res) {
            if(angFolder === false) {
                fs.mkdirSync(dir+'/Angular');
                angFolder = true;
            };
            fs.copyFileSync(dir+'/'+file, dir+'/Angular/'+file);
            callback(file, {"msg":`${file} searched tech stack available`, "tech": "angular", "file":file});
        }
        else {
            callback(file, {"msg":`${file} searched tech not available available`, "tech": "", "file":file});
        }
    } else if(skill === 'angular2') {

    } else if(skill === 'react') {
        let res = react.test(data);
        otherFiles.forEach((item) => {
            if(item == 'React')
                recFolder = true;
        })
        if(res) {
            if(recFolder === false) {
                fs.mkdirSync(dir+'/React');
                angFolder = true;
            };
            fs.copyFileSync(dir+'/'+file, dir+'/React/'+file);
            callback(file, {"msg":`${file} searched tech stack available`, "tech": "react", "file":file});
        }
        else {
            callback(file, {"msg":`${file} searched tech not available available`, "tech": "", "file":file});
        }
    }
    
}

app.use('/', express.static('public'));
const _port = 3000;
app.listen(_port, () => console.log(`server running in port ${_port}`));
