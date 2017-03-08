BIN=node_modules/.bin

build:
	$(BIN)/babel src --out-dir dist --source-maps

clean:
	rm -rf dist

test: lint
	NODE_ENV=test $(BIN)/ava

test-watch: lint
	NODE_ENV=test $(BIN)/ava --watch

lint:
	$(BIN)/eslint src test

PHONY: build clean test test-watch lint
