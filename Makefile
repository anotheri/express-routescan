test:
	npm test

coverage:
	jscoverage --no-highlight lib lib-cov
	ROUTESCAN_COV=1 ROUTESCAN_TEST=1 ./node_modules/.bin/mocha -R html-cov > coverage.html
	rm -rf lib-cov

.PHONY: test