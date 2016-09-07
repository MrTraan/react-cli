#!/usr/bin/env node
'use strict'

const fs = require('fs')

const templates = require('./templates.js');

const log = (...args) => {console.log(...args)}
const logError = (...args) => {console.error(...args)}

const handleFileWritingErr = (err) => {
	switch (err.code) {
		case 'EEXIST':
			logError(`A file named ${err.path} already exists!`)
			break
		default:
			logError(err)
	}
}

const main = (args) => {
	if (!args || args.length < 3) {
		return printUsage()
	}

	switch (args[2]) {
		case 'g': case 'generate':
			generate(args.slice(3))
			break
		default:
			printUsage()
	}
}

const printUsage = () => {
	log('I should explain usage here')
}

const generate = (args) => {
	if (!args || args.length < 2) {
		return printUsage()
	}

	switch(args[0]) {
		case 'component': case 'c':
			generateComponents(args.slice(1))
			break
		default:
			printUsage()
	}
}

const generateComponents = (components) => {
	components.forEach(c => {
		fs.writeFile(
			`${c.toLowerCase()}.component.jsx`,
			templates.component(c),
			{ flag: 'wx' },
			(err) => {
				if (err) {
					return handleFileWritingErr(err);
				}
				log(`Component ${c} created`);
			}
		)
	})
}

main(process.argv)
