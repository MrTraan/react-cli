'use strict'

const util = require('util')
const fs = require('fs')

const templates = require('./templates.js')

const charToRemove = /[-_ ]/

const classify = (str) => str
	.split(charToRemove)
	.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
	.join('')

const lower = (str) => str.replace(charToRemove, '_').toLowerCase()
const spacify = (str) => str.replace(charToRemove, ' ').toLowerCase()
const upper = (str) => str.replace(charToRemove, '_').toUpperCase()
const camel = (str) => str.charAt(0).toLowerCase() + classify(str).slice(1)

const formatTemplate = (template, name, fields) => {
	return template
		.replace('%sS', camel(name))
		.replace('%ss', spacify(name))
		.replace('%s', lower(name))
		.replace('%S', classify(name))
		.replace('%handlers%', createHandlers(fields))
		.replace('%inputs%', createInputs(fields))
		.replace('%defaultState%', createDefaultState(fields))
}

const formatField = (template, name, flag) => {
	return template
		.replace('%sS', camel(name))
		.replace('%ss', spacify(name))
		.replace('%s', lower(name))
		.replace('%S', classify(name))
		.replace('%t', findType(flag))
}

const templateComponent = (name) => {
	return Promise.resolve(formatTemplate(templates.componentTemplate, name))
}

const templateForm = (name, fields) => {
	return Promise.resolve(formatTemplate(templates.formTemplate, name, fields))
}


const createHandlers = (fields) => {
	if (!fields) return ''

	return Object.keys(fields)
		.filter(key => key !== '_')
		.map(key => fields[key])
		.reduce((a, b) => a.concat(b))
		.map(entry => formatField(templates.handlerTemplate, entry))
		.join('\n')
}

const createInputs = (fields) => {
	if (!fields) return ''

	return Object.keys(fields)
		.filter(key => key !== '_')
		.map(key => fields[key].map(input => formatField(templates.inputTemplate, input, key)))
		.reduce((a, b) => a.concat(b))
		.join('\n')
}

const findType = (flag) => {
	if (!flag) return ''

	switch (flag) {
		case 'p': case 'password':
			return 'password'
		case 'n': case 'number':
			return 'number'
		case 't': case 'text':
			return 'text'
		default:
			return 'text'
	}
}


const createDefaultState = (fields) => {
	if (!fields) return ''

	return Object.keys(fields)
		.filter(key => key !== '_')
		.map(key => fields[key].map(input => formatField(templates.defaultStateTemplate, input, key)))
		.reduce((a, b) => a.concat(b))
		.join('\n')
}

module.exports = {
	component: templateComponent,
	form: templateForm
}
