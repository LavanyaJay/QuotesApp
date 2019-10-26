import React, { Component } from "react";

export default class AddQuote extends Component {
	state = {
		author: "",
		quote: ""
	};

	handleSubmit = event => {
		event.preventDefault();
		this.props.addQuote(this.state.author, this.state.quote);
		this.setState({ author: "", quote: "" });
	};

	handleChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};
	render() {
		return (
			<div>
				<form onSubmit={event => this.handleSubmit(event)}>
					<label>Author:</label>
					<input
						ontype="text"
						name="author"
						onChange={this.handleChange}
						value={this.state.author}
					/>
					<label>Quote:</label>
					<input
						ontype="text"
						name="quote"
						onChange={this.handleChange}
						value={this.state.quote}
					/>
					<input type="submit" value="Add Quote" />
				</form>
			</div>
		);
	}
}
