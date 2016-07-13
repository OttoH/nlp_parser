var request = require('request');
var htmlDecode = require('js-htmlencode').htmlDecode;

var myRegexp = /(<TIMEX3.*<\/TIMEX3>)/g;
var result = '';

// console.log(process.argv);
if (!process.argv[2] || !process.argv[3]) {
    return;
}
console.log('params: ', process.argv[2] + ' | ' + process.argv[3]);
request.post('http://nlp.stanford.edu:8080/sutime/process', {form:{
    d: process.argv[2],
    annotator: 'sutime',
    q: process.argv[3],
    markTimeRanges: 'on',
    includeRange: 'on',
    rules: 'english',
    relativeHeuristicLevel: 'NONE'
    }}, function (err, res) {
    
    if (err) {
        console.error('upload failed:', err);

    } else {
        if (res.body) {
            var body = htmlDecode(decodeURIComponent(res.body));
            var match = myRegexp.exec(body);
            
            while(match !== null) {
                result += match[0];
                match = myRegexp.exec(body);
            }
        }
    }
    console.log('successful! result: ', result); 
    return result;
});
