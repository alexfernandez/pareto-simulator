'use strict'

const alpha = 1.16
const xm = 1
const total = 100000
const percents = [5, 50, 90, 95, 99, 99.9, 100]
const timeout = xm * 10

let sum = 0
let min = Infinity
let max = 0
const percentiles = {}
const parallel = 10
const series = 10

const samples = computeSamples()
showStats(samples)

function computeSamples() {
	const samples = []
	for (let i = 0; i < total; i++) {
		const sample = computeSample()
		samples.push(sample)
		sum += sample
		if (sample > max) max = sample
		if (sample < min) min = sample
	}
	return samples
}

function computeSample() {
	if (parallel == 1 && series == 1) {
		return computePareto()
	}
	let sum = 0
	for (let i = 0; i < series; i++) {
		let max = 0
		for (let j = 0; j < parallel; j++) {
			const sample = computePareto()
			if (sample > max) max = sample
		}
		sum += max
	}
	return sum
}

function computePareto() {
	const random = Math.random()
	const sample = xm / (random ** (1 / alpha))
	if (sample <= timeout) return sample
	return timeout + computePareto()
}

function showStats(samples) {
	samples.sort((a, b) => a - b)
	const average = sum / total
	for (const percent of percents) {
		percentiles[percent] = samples[total * percent / 100]
	}
	console.log(`Pareto distribution with xm=${xm} and alpha=${alpha}`)
	console.log(`Server requests: ${series} calls in parallel, ${parallel} in parallel`)
	console.log(`Average: ${average}, min: ${min}, max: ${max}`)
	console.log(`Percentiles: ${JSON.stringify(percentiles, null, '\t')}`)
}

