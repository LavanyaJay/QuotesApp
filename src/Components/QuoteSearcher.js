import React, { Component } from "react";
import Quote from "./Quote";
import Form from "./Form";

export default class QuoteSearcher extends Component {
	state = {
		isLoading: true,
		searchText: "",
		quotes: [],
		likes: {},
		dislikes: {},
		noData: false,
		color: {},
		distinctCount: 0,
		newLoad: true
	};

	componentDidMount() {
		this.setState({ isLoading: false });
	}

	//Function to fetch data on search string
	updateSearchText = text => {
		if (text !== "") {
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

					//Check if data was fetched
					if (!searchQuotesList.length) {
						this.setState({ noData: true });
					} else {
						//Filtering duplicate data
						this.setState({ noData: false });
						const filteredsearchQuotesList = this.removeDuplicates(
							searchQuotesList,
							"quoteText"
						);

						const likes = filteredsearchQuotesList.reduce((acc, quote) => {
							return { ...acc, [quote.id]: 0 };
						}, {});

						const dislikes = filteredsearchQuotesList.reduce((acc, quote) => {
							return { ...acc, [quote.id]: 0 };
						}, {});

						const color = filteredsearchQuotesList.reduce((acc, quote) => {
							return { ...acc, [quote.id]: "black" };
						}, {});

						filteredsearchQuotesList.forEach(function(element) {
							element.color = "black";
						});

						this.updateQuotes(
							filteredsearchQuotesList,
							likes,
							dislikes,
							text,
							color
						);
					}
				})
				.catch(console.error);
		}
	};

	//Function to remove duplicates
	removeDuplicates = (array, key) => {
		return array.reduce((filterList, quote) => {
			if (!filterList.find(item => item[key] === quote[key])) {
				filterList.push(quote);
			}
			return filterList;
		}, []);
	};

	//Function to calculate distinct authors count
	findDistinctCount(filteredsearchQuotesList) {
		const unique = [
			...new Set(filteredsearchQuotesList.map(quote => quote.quoteAuthor))
		];
		return unique.length;
	}

	//Function to update state data after fetch.
	updateQuotes(filteredsearchQuotesList, likes, dislikes, text, color) {
		this.setState({
			quotes: filteredsearchQuotesList,
			isLoading: false,
			likes: likes,
			dislikes: dislikes,
			searchText: text,
			color: color
		});
	}

	//Function to calculate and update likes for each quote
	updateLikes = id => {
		const index = this.state.quotes.map(e => e.id).indexOf(id);
		this.state.quotes[index].color = "green";

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
		const index = this.state.quotes.map(e => e.id).indexOf(id);
		this.state.quotes[index].color = "red";

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

	//Adding Quotes
	addQuote = (author, text) => {
		const newQuote = {
			id: Math.round(Math.random() * 10000) + "",
			quoteText: text,
			quoteAuthor: author
		};

		this.setState({
			quotes: this.state.quotes.concat(newQuote)
		});
	};

	//Function to calculate total likes
	findTotalLikes() {
		//Calculate totalLikes and totalDislikes
		const totalLikesandDisLikes = this.state.quotes.map(quote => ({
			...quote,
			likes: this.state.likes[quote.id],
			dislikes: this.state.dislikes[quote.id]
		}));
		const totalLikes = totalLikesandDisLikes.reduce((sum, quote) => {
			return sum + quote["likes"];
		}, 0);
		return totalLikes;
	}

	//Function to calculate total dislikes
	findTotalDisLikes() {
		//Calculate totalLikes and totalDislikes
		const totalLikesandDisLikes = this.state.quotes.map(quote => ({
			...quote,
			likes: this.state.likes[quote.id],
			dislikes: this.state.dislikes[quote.id]
		}));
		const totalDisLikes = totalLikesandDisLikes.reduce((sum, quote) => {
			return sum + quote["dislikes"];
		}, 0);
		return totalDisLikes;
	}

	render() {
		//Display error message when no data found
		if (this.state.noData) {
			return (
				<div>
					Sorry, no quotes for the search found!
					<h1>Quotes List</h1>
					<Form updateSearchText={this.updateSearchText} />
					<p>Likes:0/Dislikes:0</p>
				</div>
			);
		} else {
			return (
				<div>
					{this.state.isLoading && "Loading..."}

					<h1>Quotes List</h1>

					<p>
						Likes:{this.findTotalLikes()}/Dislikes:
						{this.findTotalDisLikes()}
					</p>
					<p>
						Distinct Author Count:{this.findDistinctCount(this.state.quotes)}
					</p>
					<Form
						updateSearchText={this.updateSearchText}
						addQuote={this.addQuote}
					/>

					<div>
						{this.state.quotes.map(quote => {
							return (
								<div>
									<Quote
										quoteId={quote.id}
										quoteText={quote.quoteText}
										quoteAuthor={quote.quoteAuthor}
										updateLikes={this.updateLikes}
										updateDisLikes={this.updateDisLikes}
										likes={this.state.likes[quote.id]}
										dislikes={this.state.dislikes[quote.id]}
										color={quote.color}
										newLoad={this.state.newLoad}
									/>
								</div>
							);
						})}
					</div>
				</div>
			);
		}
	}
}
