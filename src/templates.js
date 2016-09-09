'use strict'

const componentTemplate = 
`'use strict'

import React from 'react';

export default class %S extends React.Component {

}
`

const formTemplate = 
`'use strict'

import React from 'react';

export default class %S extends React.Component {

	state = {
%defaultState%
	}

	handleSubmit = (e) => {
		e.preventDefault();
	}
	
%handlers%

	render() {
		return (
			<form className="%sS" onSubmit={this.handleSubmit}>
%inputs%
				<input type="submit" value="Post" />
			</form>
		)
	}
}
`

const handlerTemplate = 
`	handle%SChange = (e) => {
		this.setState({ %s: e.target.value });
	}`

const inputTemplate = 
`				<input
					type="%t"
					placeholder="%ss"
					value={this.state.%sS}
					onChange={this.handle%SChange}
				/>`

const defaultStateTemplate = 
`		%s: '',`

module.exports = {
	componentTemplate,
	formTemplate,
	handlerTemplate,
	inputTemplate,
	defaultStateTemplate
}
