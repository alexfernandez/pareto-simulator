# Pareto Simulator

Simulates a number of incoming requests with response times
following a [Pareto distribution](https://en.wikipedia.org/wiki/Pareto_distribution):
a very simple power law distribution.

## Installation

Run from your console:

```
$ npm install -g pareto-simulator
```

## Usage

Now you can run the Pareto simulator as a command:

```
$ pareto --xm 28
```

To simulate a search on the
[mythical 1000 Google servers](https://www.computerweekly.com/news/2240088495/Single-Google-search-uses-1000-servers):

```
$ pareto --xm 1 -n 1000 --parallel 30 --series 30 --timeout 10 --linear
```

This simulates a request that branches out to 30 * 30 servers.
There are 30 steps, each consisting of 30 parallel invocations.
Each service is designed to take at least 1 millisecond,
with response times following a Pareto distribution,
and with a timeout of 10 ms.
The result is a nice linear graph that approaches a normal distribution.

## Options

Use `--help` to see all the options.

```
The following options are supported:
  -a, --alpha <ARG1>    	Alpha parameter for Pareto ("1.16" by default)
  -x, --xm <ARG1>       	Xm (minimum) for Pareto (required)
  -n, --number <ARG1>   	Number of requests to simulate ("100000" by default)
  -t, --timeout <ARG1>  	Timeout
  -p, --parallel <ARG1> 	Requests in parallel ("1" by default)
  -s, --series <ARG1>   	Consecutive requests ("1" by default)
```

## Acknowledgements

(C) Alex Fernández. Published under the [MIT license](LICENSE).

