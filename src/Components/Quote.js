import React, { Component } from "react";
import "./Quote.css";
export default class Quote extends Component {
	state = {
		color: ""
	};
	handleButton = event => {
		if (event.target.name === "likeBtn") {
			if (this.state.color === "green") {
				this.setState({ color: "black" });
			}
			this.setState({ color: "green" });
			this.props.updateLikes(this.props.quoteId);
		} else {
			if (this.state.color === "red") {
				this.setState({ color: "black" });
			}
			this.setState({ color: "red" });
			this.props.updateDisLikes(this.props.quoteId);
		}
	};
	render() {
		return (
			<div>
				<p style={{ color: this.state.color }}>{this.props.quoteText}</p>
				<p>By: {this.props.quoteAuthor}</p>

				<button name="likeBtn" onClick={this.handleButton}>
					:)
				</button>

				<button name="dislikeBtn" onClick={this.handleButton}>
					:(
				</button>
			</div>
		);
	}
}
