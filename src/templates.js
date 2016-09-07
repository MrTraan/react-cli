'use strict'

const util = require('util')

const COMPONENT_TEMPLATE = `'use strict'

const React = require('react');

module.exports = class %s extends React.Component {
	
}
`

const classify = str => {
	return str.split(/[-_ ]/).map(part => {
			return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
		}).join('')
}

module.exports = {
	component: (name) => util.format(COMPONENT_TEMPLATE, classify(name))
}
