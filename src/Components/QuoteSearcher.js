import React, { Component } from "react";
import Quote from "./Quote";
import Form from "./Form";

export default class QuoteSearcher extends Component {
	state = {
		isLoading: true,
		searchText: "",
		quotes: [],
		likes: {},
		dislikes: {}
	};

	componentDidMount() {
		this.setState({ isLoading: false });
	}

	//Function to fetch data on search string
	updateSearchText = text => {
		this.setState({ isLoading: true });
		fetch(`https://quote-garden.herokuapp.com/quotes/search/${text}`)
			.then(res => res.json())

			.then(searchQuotes => {
				const searchQuotesList = searchQuotes.results.map(quote => {
					return {
						id: quote["_id"],
						quoteText: quote["quoteText"],
						quoteAuthor: quote["quoteAuthor"]
					};
				});
				const likes = searchQuotesList.reduce((acc, quote) => {
					return { ...acc, [quote.id]: 0 };
				}, {});
				const dislikes = searchQuotesList.reduce((acc, quote) => {
					return { ...acc, [quote.id]: 0 };
				}, {});
				this.setState({});

				this.updateQuotes(searchQuotesList, likes, dislikes, text);
			})
			.catch(console.error);
	};

	//Function to update state data after fetch.
	updateQuotes(treeQuotesList, likes, dislikes, text) {
		this.setState({
			quotes: treeQuotesList,
			isLoading: false,
			likes: likes,
			dislikes: dislikes,
			searchText: text
		});
	}

	//Function to calculate and update likes for each quote
	updateLikes = (id, bold) => {
		const updatedLikes = {
			...this.state.likes,
			[id]: this.state.likes[id] + 1
		};
		if (this.state.dislikes[id] > 0) {
			const updatedDisLikes = {
				...this.state.dislikes,
				[id]: this.state.dislikes[id] - 1
			};

			this.setState({
				dislikes: updatedDisLikes,
				likes: updatedLikes
			});
		} else {
			this.setState({ likes: updatedLikes });
		}
	};

	//Function to calculate and update dislikes for each quote
	updateDisLikes = id => {
		const updatedDisLikes = {
			...this.state.dislikes,
			[id]: this.state.dislikes[id] + 1
		};

		if (this.state.likes[id] > 0) {
			const updatedLikes = {
				...this.state.likes,
				[id]: this.state.likes[id] - 1
			};

			this.setState({
				dislikes: updatedDisLikes,
				likes: updatedLikes
			});
		} else {
			this.setState({
				dislikes: updatedDisLikes
			});
		}
	};

	render() {
		//Calculate totalLikes and totalDislikes
		const totalLikesandDisLikes = this.state.quotes.map(quote => ({
			...quote,
			likes: this.state.likes[quote.id],
			dislikes: this.state.dislikes[quote.id]
		}));
		const totalLikes = totalLikesandDisLikes.reduce((sum, quote) => {
			return sum + quote["likes"];
		}, 0);
		//console.log(`totallikes${totalLikes}`);
		const totalDisLikes = totalLikesandDisLikes.reduce((sum, quote) => {
			return sum + quote["dislikes"];
		}, 0);
		//console.log(`totaldislikes${totalDisLikes}`);

		return (
			<div>
				{this.state.isLoading && "Loading..."}
				<h1>Quotes List</h1>
				<Form updateSearchText={this.updateSearchText} />
				<p>
					Likes:{totalLikes}/Dislikes:{totalDisLikes}
				</p>

				<div>
					{this.state.quotes.map(quote => {
						return (
							<Quote
								quoteId={quote.id}
								quoteText={quote.quoteText}
								quoteAuthor={quote.quoteAuthor}
								updateLikes={this.updateLikes}
								updateDisLikes={this.updateDisLikes}
								likes={this.state.likes[quote.id]}
								dislikes={this.state.dislikes[quote.id]}
							/>
						);
					})}
				</div>
			</div>
		);
	}
}
