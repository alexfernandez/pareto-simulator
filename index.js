const {getopt} = require('stdio')

const percents = [5, 50, 90, 95, 99, 99.9]
const options = getopt({
	alpha: {key: 'a', args: 1, description: 'Alpha parameter for Pareto', default: 1.16},
	xm: {key: 'x', args: 1, description: 'Xm (minimum) for Pareto', required: true},
	number: {key: 'n', args: 1, description: 'Number of requests to simulate', default: 100000},
	timeout: {key: 't', args: 1, description: 'Timeout', default: ''},
	parallel: {key: 'p', args: 1, description: 'Requests in parallel', default: 1},
	series: {key: 's', args: 1, description: 'Consecutive requests', default: 1},
	linear: {key: 'l', description: 'Show linear graph instead of log-log'},
	error: {key: 'e', args: 1, description: 'Add randomly distributed errors', default: '0'},
})
const intervals = 15

class Simulation {
	constructor() {
		this.samples = []
		this.sum = 0
		this.min = Infinity
		this.max = 0
	}

	computeSamples() {
		for (let i = 0; i < options.number; i++) {
			const sample = this.computeSample()
			this.samples.push(sample)
			this.sum += sample
			if (sample > this.max) this.max = sample
			if (sample < this.min) this.min = sample
		}
	}

	computeSample() {
		if (options.parallel == 1 && options.series == 1) {
			return this.computePareto()
		}
		let sum = 0
		for (let i = 0; i < options.series; i++) {
			let max = 0
			for (let j = 0; j < options.parallel; j++) {
				const sample = this.computePareto()
				if (sample > max) max = sample
			}
			sum += max
		}
		return sum
	}

	computePareto(retryAccumulatedTime = 0) {
		const random = Math.random()
		const error = options.error * Math.random()
		const sample = options.xm / (random ** (1 / options.alpha)) + error
		if (!options.timeout || sample <= options.timeout) return sample + retryAccumulatedTime
		return this.computePareto(parseFloat(options.timeout) + retryAccumulatedTime)
	}

	showStats() {
		const percentiles = {}
		this.samples.sort((a, b) => a - b)
		for (const percent of percents) {
			percentiles[percent] = this.samples[options.number * percent / 100].toFixed(2)
		}
		const average = this.sum / options.number
		console.log(`Pareto distribution with xm=${options.xm} and alpha=${options.alpha}`)
		console.log(`Server requests: ${options.series} calls in series, ${options.parallel} in parallel`)
		console.log(`Average: ${average.toFixed(2)}, min: ${this.min.toFixed(2)}, max: ${this.max.toFixed(2)}`)
		console.log(`Percentiles: ${JSON.stringify(percentiles, null, '\t')}`)
	}

	showGraph() {
		const lxmin = this.forward(this.min)
		const lxmax = this.forward(this.max)
		const interval = (lxmax - lxmin) / intervals
		const histogram = {}
		const buckets = []
		let ymax = 0
		for (let i = 0; i < this.samples.length; i++) {
			const lx = this.forward(this.samples[i])
			const bucket = Math.floor((lx - lxmin) / interval)
			buckets[bucket] = (buckets[bucket] || 0) + 1
			if (buckets[bucket] > ymax) ymax = buckets[bucket]
		}
		const lymax = this.forward(ymax)
		for (let i = 0; i < buckets.length; i++) {
			const x = this.reverse(lxmin + i * interval)
			const ly = this.forward(buckets[i]) * 80 / lymax
			histogram[x] = ly
			const label = String(Math.round(x))
			console.log(`${' '.repeat(10 - label.length)}${label} ${'*'.repeat(ly)}`)
		}
	}

	forward(value) {
		if (options.linear) return value
		return Math.log(value)
	}

	reverse(value) {
		if (options.linear) return value
		return Math.exp(value)
	}
}

const simulation = new Simulation()
simulation.computeSamples()
simulation.showStats()
simulation.showGraph()

