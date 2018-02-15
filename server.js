var PNF = require('google-libphonenumber').PhoneNumberFormat;
var phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
var express = require('express');
var multer = require('multer');
var fs = require('fs');

var app = express();
var upload = multer({dest: 'uploads/'});

app.listen(8080, () =>{
    console.log("The server is running on port 8080.");
});

app.get('/', (req, res) => {
    res.json("Using google-libphonenumber");
});

app.get('/api/phonenumbers/parse/text/', (req,res) =>{
    res.status(204).json('testing');
});

//BUG: if numbers is not empty, but doesnt contain any phone numbers, still returns status 200
app.get('/api/phonenumbers/parse/text/:numbers', (req,res) =>{
    if(req.params.numbers == 'nothing' || (!req.params.numbers)){
        res.status(204).send();
    }
    else{
        let numArr = [];
        numArr.push(req.params.numbers);
        let result = phoneNumberParser(numArr);
        console.log(result);
        res.status(200).json(result);
    }
});

app.get('/api/phonenumbers/parse/file', (req,res) => {
    res.sendFile(__dirname + "/upload.html");
});

app.post('/api/phonenumbers/parse/file', upload.single('file'), (req, res) =>{
    if(!req.file){
        res.status(400).json("No file found");
    }
    else{
        //change to a sync - readFileSync
        var fileContents = fs.readFileSync(req.file.path);
        //if .txt file is encoded in base64, .toString('ascii') first before buffer
        //var fileContents = fileContents.toString('ascii');
        var buf = Buffer.from(fileContents, 'base64').toString();
        var phoneNumbersArray = buf.split('\n');

        let result = phoneNumberParser(phoneNumbersArray);
        console.log(result);
        res.status(200).json(result);
    }
});

function phoneNumberParser(data){
   var formattedNumbers = [];
   var numbers;

   for(var i = 0; i < data.length; i++){
       try{
        numbers = phoneUtil.parse(data[i], 'CA');

        formattedNumbers.push(phoneUtil.format(numbers, PNF.NATIONAL));
       }
       catch(error){
        //console.log(error);
       }
   }
   
   return Array.from(new Set(formattedNumbers));
}

module.exports = app;