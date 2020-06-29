var scrambleWorker = (function() {
    if (!window.Worker) { // not available due to browser capability
        return {};
    }
    var worker = new Worker('../scramble/cstimer.js');
    var callbacks = {};
    var msgid = 0;

    worker.onmessage = function(e) {
        //data: [msgid, type, ret]
        var data = e.data;
        var callback = callbacks[data[0]];
        delete callbacks[data[0]];
        callback && callback(data[2]);
    }

    //[type, length, state]
    function getScramble(args, callback) {
        ++msgid;
        callbacks[msgid] = callback;
        worker.postMessage([msgid, 'scramble', args]);
        return msgid;
    }

    return {
        getScramble: getScramble
    }
})();

// scrambleWorker.getScramble(scrambleArgs, callback);
// scrambleArgs: [scramble type, scramble length (can be ignored for some scramble types), specific state (for oll, pll, etc) or undefined]
// callback: callback function with one parameter, which is the generated scramble.

// Example
// scrambleWorker.getScramble(['333'], function(scramble) {
//     console.log(scramble); //should return a 3x3x3 random state scramble
// });

// scrambleWorker.getScramble(['444wca'], function(scramble) {
//     console.log(scramble); //this will take several seconds
// });

// scrambleWorker.getScramble(['555wca', 60], function(scramble) {
//     console.log(scramble); //In this example, scramble length is required.
// });