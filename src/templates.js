'use strict'

const util = require('util')
const fs = require('fs');

const charToRemove = /[-_ ]/

const classify = (str) => str
	.split(charToRemove)
	.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
	.join('')

const lower = (str) => str.replace(charToRemove, '_').toLowerCase()

const upper = (str) => str.replace(charToRemove, '_').toUpperCase()

const camel = (str) => str.charAt(0).toLowerCase() + classify(str).slice(1)

const formatTemplate = (template, name, fields) => {
	return template
		.replace('%SS', upper(name))
		.replace('%sS', camel(name))
		.replace('%s', lower(name))
		.replace('%S', classify(name))
}

const templateComponent = (name) => {
	return new Promise((resolve, reject) => {
		fs.readFile('./templates/component.txt', (err, data) => {	
			if (err) {
				return reject(err)
			}
			resolve(formatTemplate(data.toString(), name))
		})
	})
}

const templateForm = (name, fields) => {
	return new Promise((resolve, reject) => {
		fs.readFile('./templates/form.txt', (err, data) => {
			if (err) {
				return reject(err)
			}
			resolve(formatTemplate(data.toString(), name))
		})
	})
}

module.exports = {
	component: (name) => templateComponent(name),
	form: (name) => templateForm(name),
}
