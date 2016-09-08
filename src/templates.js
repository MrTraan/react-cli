'use strict'

const util = require('util')
const fs = require('fs');

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
		.replace('%handler%', createHandlers(fields))
		.replace('%input%', createInputs(fields))
		.replace('%defaultValues%', createDefaultValues(fields))
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
			resolve(formatTemplate(data.toString(), name, fields))
		})
	})
}

const HANDLER_TP = `
	handle%SChange = (e) => {
		this.setState({ %s: e.target.value });
	}`

const createHandlers = (fields) => {
	if (!fields) return ''

	return Object.keys(fields)
		.filter(key => key !== '_')
		.map(key => fields[key])
		.reduce((a, b) => a.concat(b))
		.map(entry => formatField(HANDLER_TP, entry))
		.join('')
}

const INPUT_TP = `
				<input
					type="%t"
					placeholder="%ss"
					value={this.state.%sS}
					onChange={this.handle%SChange}
				/>`

const createInputs = (fields) => {
	if (!fields) return ''

	return Object.keys(fields)
		.filter(key => key !== '_')
		.map(key => fields[key].map(input => formatField(INPUT_TP, input, key)))
		.reduce((a, b) => a.concat(b))
		.join('')
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

const DEFAULT_TP = `
		%s: '',`

const createDefaultValues = (fields) => {
	if (!fields) return ''

	return Object.keys(fields)
		.filter(key => key !== '_')
		.map(key => fields[key].map(input => formatField(DEFAULT_TP, input, key)))
		.reduce((a, b) => a.concat(b))
		.join('')
}

module.exports = {
	component: templateComponent,
	form: templateForm
}
