import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.min.js';
import '/scramble/main.js';
import { initSolvesDB, addSolve, getSolves } from './idb.js';

new Vue({
    el: '.main-container',
    data() {
        return {
            solves: {
                "2x2": {
                    mean: 0,
                    pb: 0,
                    arr: []
                },
                "4x4": {
                    mean: 0,
                    pb: 0,
                    arr: []
                },
                "3x3": {
                    mean: 0,
                    pb: 0,
                    arr: []
                },
                "5x5": {
                    mean: 0,
                    pb: 0,
                    arr: []
                },
                "6x6": {
                    mean: 0,
                    pb: 0,
                    arr: []
                },
                "7x7": {
                    mean: 0,
                    pb: 0,
                    arr: []
                },
                "Pyraminx": {
                    mean: 0,
                    pb: 0,
                    arr: []
                },
                "Skewb": {
                    mean: 0,
                    pb: 0,
                    arr: []
                },
                "Megaminx": {
                    mean: 0,
                    pb: 0,
                    arr: []
                },
                "Square-1": {
                    mean: 0,
                    pb: 0,
                    arr: []
                },
                "Clock": {
                    mean: 0,
                    pb: 0,
                    arr: []
                }
            },
            timerIsReady: false,
            timerIsRunning: false,
            currentScramble: '',
            currentPuzzle: '',
            currentTimeMillis: 0,
            currentTimeSeconds: 0,
            currentTimeMinutes: 0,
            currentTimeFormatted: '',
            currentStartedAt: 0,
            currentEndedAt: 0,
            currentMean: 0,
            scrambleLoaded: false,
            keyDownTime: 0,
            nextKeyDownTime: 0,
        }
    },
    methods: {
        defcurrent () {
            return {
                puzzle: '',
                startedAt: 0,
                endedAt: 0,
                mean: 0,
                time: {
                    millis: 0,
                    seconds: 0,
                    minutes: 0,
                    formatted: '',
                },
                scramble: '',
                avg: {
                    'mo3': {
                        millis: 0,
                        seconds: 0,
                        minutes: 0,
                        formatted: ''
                    },
                    'ao5': {
                        millis: 0,
                        seconds: 0,
                        minutes: 0,
                        formatted: ''
                    },
                    'ao12': {
                        millis: 0,
                        seconds: 0,
                        minutes: 0,
                        formatted: ''
                    },
                    'ao25': {
                        millis: 0,
                        seconds: 0,
                        minutes: 0,
                        formatted: ''
                    }
                }
            }
        },
        readyTimer () {
            if (!this.timerIsRunning && this.scrambleLoaded) {
                this.timerIsReady = true;
            }
        },
        startTimer () {
            if (this.timerIsReady && this.scrambleLoaded) {
                this.currentStartedAt = Date.now();
                this.timerIsRunning = true;
                this.timerIsReady = false;
            }
        },
        stopTimer() {
            if (this.timerIsRunning) {
                this.currentEndedAt = Date.now();
                this.setTime();
                let thisSolve = this.defcurrent()
                thisSolve.puzzle = this.currentPuzzle,
                thisSolve.scramble = this.currentScramble,
                thisSolve.startedAt = this.currentStartedAt,
                thisSolve.endedAt = this.currentEndedAt,
                thisSolve.time = {
                    millis: this.currentTimeMillis,
                    seconds: this.currentTimeSeconds,
                    formatted: this.currentTimeFormatted
                }
                this.solves[thisSolve.puzzle].arr.push({...thisSolve});
                this.setAvg(this.solves[thisSolve.puzzle].arr[this.solves[thisSolve.puzzle].arr.length-1]);
                this.setMean();
                this.setPB();
                addSolve(thisSolve.puzzle, {...thisSolve});
                this.setPuzzleScramble(this.currentPuzzle);
                this.timerIsRunning = false;
            }
        },
        formatTime (secs) {
            let seconds = secs;
            if (seconds > 60) {
                let minutes = Math.floor(seconds / 60)
                let leftoversecs = (seconds % 60).toFixed(2);
                if(parseFloat(leftoversecs) < 10) {
                    return `${minutes}:0${leftoversecs}`;
                } else if(leftoversecs.toString().length < 4) {
                    leftoversecs += '0';
                    return `${minutes}:${leftoversecs}`;
                } else if(parseFloat(leftoversecs) < 10 && leftoversecs.toString().length < 4) {
                    leftoversecs += '0';
                    return `${minutes}:0${leftoversecs}`;
                } else {
                    return `${minutes}:${leftoversecs}`;
                }
            } else {
                return seconds.toFixed(2);
            }
        },
        setTime () {
            let startedAt = this.currentStartedAt;
            let endedAt = this.currentEndedAt;
            if (this.timerIsRunning) {
                this.currentTimeMillis = Date.now() - startedAt;
                this.currentTimeSeconds = parseFloat(((this.currentTimeMillis) / 1000).toFixed(2));
                this.currentTimeMinutes = parseFloat((this.currentTimeSeconds / 60).toFixed(4));
                this.currentTimeFormatted = this.formatTime(this.currentTimeSeconds);
            } else {
                this.currentTimeMillis = endedAt - startedAt;
                this.currentTimeSeconds = parseFloat((this.currentTimeMillis / 1000).toFixed(2));
                this.currentTimeMinutes = parseFloat((this.currentTimeSeconds / 60).toFixed(4));
                this.currentTimeFormatted = this.formatTime(this.currentTimeSeconds);
            }
        },
        setAvg (solve) {
            let solveIndex = this.solves[this.currentPuzzle].arr.indexOf(solve);
            if (solveIndex >= 2) {
                let lastThreeSolves = this.solves[this.currentPuzzle].arr.slice(-3, solveIndex + 1);
                let threecumul = 0;
                for (let i = 0; i < lastThreeSolves.length; i++) {
                    const currSolve = lastThreeSolves[i];
                    threecumul += currSolve.time.millis;
                }
                let mo3 = threecumul / 3;
                solve.avg.mo3.millis = mo3;
                solve.avg.mo3.seconds = parseFloat((mo3 / 1000).toFixed(2));
                solve.avg.mo3.minutes = parseFloat((solve.avg.mo3.seconds / 60).toFixed(4));
                solve.avg.mo3.formatted = this.formatTime(solve.avg.mo3.seconds);
            } else {
                return 0
            }

            let avgObjs = [
                {
                    name: 'ao5',
                    num: 5
                },
                {
                    name: 'ao12',
                    num: 12
                },
                {
                    name: 'ao25',
                    num: 25
                }
            ];
            for (let i = 0; i < avgObjs.length; i++) {
                const avgObj = avgObjs[i];
                let avgStart = -avgObj.num;
                let middleEnd = avgObj.num-1;
                let middleLength = avgObj.num-2;
                if(solveIndex > middleLength) {
                    let lastFewSolves = this.solves[this.currentPuzzle].arr.slice(avgStart, solveIndex + 1);
                    lastFewSolves = lastFewSolves.sort((a, b) => (a.time.millis > b.time.millis) ? 1 : (a.time.millis < b.time.millis) ? -1 : 0);
                    let middle = lastFewSolves.slice(1, middleEnd);
                    let cumulative = 0;
                    for (let i = 0; i < middle.length; i++) {
                        let currSolve = middle[i];
                        cumulative += currSolve.time.millis;
                    }
                    let avg = cumulative / middleLength;
                    solve.avg[avgObj.name].millis = avg;
                    solve.avg[avgObj.name].seconds = parseFloat((avg / 1000).toFixed(2));
                    solve.avg[avgObj.name].minutes = parseFloat((solve.avg[avgObj.name].seconds / 60).toFixed(4));
                    solve.avg[avgObj.name].formatted = this.formatTime(solve.avg[avgObj.name].seconds);
                } else {
                    solve.avg[avgObj.name].millis = 0;
                    solve.avg[avgObj.name].seconds = 0;
                    solve.avg[avgObj.name].minutes = 0;
                    solve.avg[avgObj.name].formatted = '';
                }
            }

        },
        setPuzzleScramble (puzzle) {
            this.currentPuzzle = puzzle;
            this.scrambleLoaded = false;
            const puzzleType = puzzle == '2x2' ? '222so' : puzzle == '3x3' ? '333' : puzzle == '4x4' ? '444wca' : puzzle == '5x5' ? '555wca' : puzzle == '6x6' ? '666wca' : puzzle == '7x7' ? '777wca' : puzzle == 'Pyraminx' ? 'pyrso' : puzzle == 'Skewb' ? 'skbso' : puzzle == 'Megaminx' ? 'mgmp' : puzzle == 'Square-1' ? 'sq1h' : puzzle == 'Clock' ? 'clkwca' : null;
            // If 5x5, 6x6 or 7x7, set correct scramble lengths accordingly
            if (puzzleType !== '555wca' && puzzleType !== 'mgmp' && puzzleType !== '666wca' && puzzleType !== '777wca') {
                scrambleWorker.getScramble([puzzleType], scramble => {
                    this.currentScramble = scramble;
                    this.scrambleLoaded = true;
                });
            } else if (puzzleType == '555wca') {
                scrambleWorker.getScramble([puzzleType, 60], scramble => {
                    this.currentScramble = scramble;
                    this.scrambleLoaded = true;
                });
            } else if (puzzleType == 'mgmp') {
                scrambleWorker.getScramble([puzzleType, 70], scramble => {
                    let scrambleFormatted = scramble.split('~\\n').join('<br>').split('\'\\n').join('\'<br>');
                    this.currentScramble = scrambleFormatted;
                    this.scrambleLoaded = true;
                });
            } else if (puzzleType == '666wca') {
                scrambleWorker.getScramble([puzzleType, 80], scramble => {
                    this.currentScramble = scramble;
                    this.scrambleLoaded = true;
                });                   
            } else if (puzzleType == '777wca') {
                scrambleWorker.getScramble([puzzleType, 100], scramble => {
                    this.currentScramble = scramble;
                    this.scrambleLoaded = true;
                });
            }
            // this.solves[puzzle].arr = getSolves(puzzle);
        },
        setMean () {
            let currentSolves = this.solves[this.currentPuzzle];
            if(currentSolves.arr.length > 0) {
                let cumulative = 0;
                for (let solve in currentSolves.arr) {
                    let tempSolve = currentSolves.arr[solve];
                    cumulative += tempSolve.time.seconds;
                }
                currentSolves.mean = parseFloat((cumulative / currentSolves.arr.length).toFixed(2));
            } else {
                currentSolves.mean = 0;
            }
        },
        setPB () {
            let tempSolves = [...this.solves[this.currentPuzzle].arr]
            if (tempSolves.length > 0) {
                tempSolves.sort((a, b) => (a.time.seconds > b.time.seconds) ? 1 : -1);
                this.solves[this.currentPuzzle].pb = tempSolves[0].time.seconds;
            }
        }
    },
    async mounted () {
        this.setPuzzleScramble('3x3');
        initSolvesDB();
        for (let puzzle in this.solves) {
            this.solves[puzzle].arr = await getSolves(puzzle);
            this.setMean();
            this.setPB();
        }
        window.addEventListener('keydown', event => {
            if (event.keyCode == 32) {
                this.readyTimer();
                this.stopTimer();
            }
        });
        window.addEventListener('keyup', event => {
            if (event.keyCode == 32) this.startTimer();
        });
        window.setInterval(() => {
            if(this.timerIsRunning) this.setTime();
        }, 15);
    }
})