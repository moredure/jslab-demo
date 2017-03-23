#!/usr/bin/env sh
`npm bin`/nyc\
    --reporter=html\
    --reporter=text\
    `npm bin`/mocha --require should --recursive;
