const {getopt} = require('stdio')

const percents = [5, 50, 90, 95, 99, 99.9]
const options = getopt({
    alpha: {key: 'a', args: 1, description: 'Alpha parameter for Pareto', default: 1.16},
    xm: {key: 'x', args: 1, description: 'Xm (minimum) for Pareto', required: true},
    number: {key: 'n', args: 1, description: 'Number of requests to simulate', default: 100000},
    timeout: {key: 't', args: 1, description: 'Timeout', default: ''},
    parallel: {key: 'p', args: 1, description: 'Requests in parallel', default: 1},
    series: {key: 's', args: 1, description: 'Consecutive requests', default: 1},
})

const samples = computeSamples()
showPercentiles(samples)

function computeSamples() {
	let sum = 0
	let min = Infinity
	let max = 0
	const samples = []
	for (let i = 0; i < options.number; i++) {
		const sample = computeSample()
		samples.push(sample)
		sum += sample
		if (sample > max) max = sample
		if (sample < min) min = sample
	}
	const average = sum / options.number
	console.log(`Pareto distribution with xm=${options.xm} and alpha=${options.alpha}`)
	console.log(`Server requests: ${options.series} calls in parallel, ${options.parallel} in parallel`)
	console.log(`Average: ${average.toFixed(2)}, min: ${min.toFixed(2)}, max: ${max.toFixed(2)}`)
	return samples
}

function computeSample() {
	if (options.parallel == 1 && options.series == 1) {
		return computePareto()
	}
	let sum = 0
	for (let i = 0; i < options.series; i++) {
		let max = 0
		for (let j = 0; j < options.parallel; j++) {
			const sample = computePareto()
			if (sample > max) max = sample
		}
		sum += max
	}
	return sum
}

function computePareto() {
	const random = Math.random()
	const sample = options.xm / (random ** (1 / options.alpha))
	if (!options.timeout || sample <= options.timeout) return sample
	return parseFloat(options.timeout) + computePareto()
}

function showPercentiles(samples) {
	const percentiles = {}
	samples.sort((a, b) => a - b)
	for (const percent of percents) {
		percentiles[percent] = samples[options.number * percent / 100].toFixed(2)
	}
	console.log(`Percentiles: ${JSON.stringify(percentiles, null, '\t')}`)
}

