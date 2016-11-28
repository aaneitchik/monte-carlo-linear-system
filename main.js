const fs = require('fs');

/* Read input file */
let A = fs.readFileSync('inputSystem.txt').toString().split('\n');
const n = +A.shift();
let f = A.pop().split(' ').map(num => +num);
A.pop();
A = A.map(line => line.split(' ').map(num => +num));

/* Define constants */
const chainLength = 1000;
const markovCount = 10000;

const pi = Array(n).fill(1/n);
const p = Array(n).fill(Array(n).fill(1/n));
const result = [];

/* x is a system variable */
for(let x = 0; x < n; x++) {
	const h = Array(n).fill(0);
	h[x] = 1;

	let randomVar = [];
	let markovChain = [];
	let markovWeight = [];

	for(let chainIndex = 0; chainIndex < markovCount; chainIndex++) {
		if (chainIndex % 500 == 0) {
			console.log(((markovCount * x + chainIndex) / (markovCount * n) * 100).toFixed(2) + '% completed');
		}

		let BRV = Math.random();
		markovChain[0] = Math.floor(n * BRV);
		for(let i = 1; i <= chainLength; i++) {
			BRV = Math.random();
			markovChain[i] = Math.floor(n * BRV);
		}
		
		/* Calc Markov chain weights */
		markovWeight[0] = pi[markovChain[0]] > 0 ? h[markovChain[0]] / pi[markovChain[0]] : 0;
		for(let i = 1; i <= chainLength; i++) {
			markovWeight[i] = p[markovChain[i-1]][markovChain[i]] > 0 ?
				markovWeight[i - 1] * A[markovChain[i-1]][markovChain[i]] / p[markovChain[i-1]][markovChain[i]] : 0;
		}
		randomVar[chainIndex] = markovChain.reduce((sum, curr, index) => {
			return sum + markovWeight[index] * f[curr];
		}, 0);
	}

	result[x] = randomVar.reduce((sum, curr) => {
		return sum + curr;
	}, 0);

	result[x] = result[x] / markovCount;
}

console.log(result);






