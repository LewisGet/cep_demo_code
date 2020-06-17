const fs = require('fs');
const srtJsonToWordLinesJson = require('./srtJsonToWordLinesJson.js');
const srtJsonWordLinesJsonToautoEditJson = require('./srtJsonWordLinesJsonToautoEditJson.js');
const srtToJsonLine = require('./srtToJsonLine.js');
const timecodesToSeconds = require('./timecodesToSecond.js');

function convert(captionsFilePath){
    const captionsString = openFile(captionsFilePath);
    var srtLineJson = srtToJsonLine(captionsString);
    fs.writeFileSync('/Users/pietropassarelli/Dropbox/CODE/Vox/TBVE/autoEdit_2/lib/interactive_transcription_generator/transcriber/captions/examples/srtLineJson.json',JSON.stringify(srtLineJson,null,2))
    var srtLineJsonSecondsTimecodes = convertTimecodesToSeconds(srtLineJson);
    var result = srtJsonToWordLinesJson(srtLineJsonSecondsTimecodes);
    result = srtJsonWordLinesJsonToautoEditJson(result);
    return result;
}

function convertTimecodesToSeconds(srtLineJsonArray){
    var result =  srtLineJsonArray.map((lineObject)=>{
        return {
            startTime :timecodesToSeconds(lineObject.startTime),
            endTime : timecodesToSeconds(lineObject.endTime),
            id: lineObject.id,
            text: lineObject.text
        };
    })
    return result;
}

// open file helper
function openFile(filePath){
    return fs.readFileSync(filePath).toString('utf8');
}

module.exports = convert;