# Pareto Simulator

Simulates a number of incoming requests with response times
following a [Pareto distribution](https://en.wikipedia.org/wiki/Pareto_distribution):
a very simple power law distribution.

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

