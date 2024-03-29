import React, { Component } from "react";
import AddQuote from "./AddQuote";
export default class Form extends Component {
	state = {
		searchTxt: ""
	};

	handleChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	handleSubmit = event => {
		event.preventDefault();
		this.props.updateSearchText(this.state.searchTxt);
		this.setState({ searchTxt: "" });
	};

	render() {
		return (
			<div>
				<form onSubmit={event => this.handleSubmit(event)}>
					<input
						ontype="text"
						name="searchTxt"
						onChange={this.handleChange}
						value={this.state.searchText}
					/>
					<input type="submit" value="Search" />
				</form>
				<AddQuote addQuote={this.props.addQuote} />
			</div>
		);
	}
}
