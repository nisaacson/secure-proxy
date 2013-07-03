MOCHA=node_modules/.bin/mocha
CONFIG?=test/config.json
REPORTER?=tap
FLAGS=--config $(CONFIG) --reporter $(REPORTER)

test:
	$(MOCHA) $(shell find test/* -prune -name "*test.js") $(FLAGS)

start:
	$(MOCHA) test/start-test.js $(FLAGS)

proxy:
	$(MOCHA) test/proxy-test.js $(FLAGS)

cli-config:
	$(MOCHA) test/cli-config-test.js $(FLAGS)

.PHONY: test

