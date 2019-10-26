import React, { Component } from "react";
import "./Quote.css";

export default class Quote extends Component {
	state = {
		color: ""
	};

	handleButton = event => {
		if (event.target.name === "likeBtn") {
			this.props.updateLikes(this.props.quoteId);
		} else {
			this.props.updateDisLikes(this.props.quoteId);
		}
	};

	render() {
		return (
			<div>
				<div>
					<p style={{ color: this.props.color }}>{this.props.quoteText}</p>
					<p>By: {this.props.quoteAuthor}</p>

					<button name="likeBtn" onClick={this.handleButton}>
						:)
					</button>

					<button name="dislikeBtn" onClick={this.handleButton}>
						:(
					</button>
				</div>
			</div>
		);
	}
}
