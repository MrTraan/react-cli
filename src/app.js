#!/usr/bin/env node
'use strict'

const fs = require('fs')

const templates = require('./templates.js')

const log = (...args) => { console.log(...args) }
const logError = (...args) => { console.error(...args) }

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

	if (args.length == 3) {
		return generateComponents([args[2]])
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
		case 'form': case 'f':
			generateForm(args[1], args.slice(2))
			break
		default:
			printUsage()
	}
}

const generateForm = (name, fields) => {
	templates.form(name)
	.then(data => writeComponentTemplate(name, data))
	.then(() => log(`Form ${name} created`))
	.catch(err => logError(err))
}

const generateComponents = (components) => {
	components.forEach(c => {
		templates.component(c)
		.then(data => writeComponentTemplate(c, data))
		.then(() => log(`Component ${c} created`))
		.catch(err => logError(err))
	})
}

const writeComponentTemplate = (name, data) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(
			`${name.toLowerCase()}.component.jsx`,
			data,
			{ flag: 'wx' },
			(err) => {
				if (err) {
					return reject(err)
				}
				resolve()
			}
		)
	})
}

main(process.argv)
