import React from "react";
import Joi from "joi-browser";
import { getReading, saveReading } from "../services/readingsService";
import Form from "./common/form";
import "bootstrap/dist/css/bootstrap.min.css";
import strings from "../services/textService";

class ReadingForm extends Form {
	state = {
		data: {
			reading: null,
		},
		imageData: null,
		errors: {},
	};

	schema = {
		_id: Joi.string(),
		title: Joi.string(),
		author: Joi.string(),
		ISBN: Joi.string(),
		description: Joi.string().empty(""),
		pages: Joi.number().empty(""),
		imageURL: Joi.string().empty(""),

		users_id: Joi.string(),
		books_id: Joi.string(),
		current_page: Joi.number(),
		time_spent: Joi.number(),
		rating: Joi.number().min(0).max(5),
		comments: Joi.string().empty(""), // Optional
	};

	async populateReading() {
		try {
			const readingId = this.props.match.params.id;
			if (readingId === "new") return;
			const { data: reading } = await getReading(readingId);
			// console.log("<<<RAW DATA>>>", reading[0]);
			this.setState({ data: this.mapToViewModel(reading[0]) });
			// console.log("<<<MAPPED DATA>>>", this.state.data);
		} catch (ex) {
			if (ex.request && ex.request.status === 404)
				this.props.history.replace("/not-found");
		}
	}

	async componentDidMount() {
		await this.populateReading();
	}

	mapToViewModel(reading) {
		return {
			_id: reading._id,
			users_id: reading.users_id,
			books_id: reading.books_id,
			title: reading.books_data.title,
			author: reading.books_data.author,
			ISBN: reading.books_data.ISBN,
			description: reading.books_data.description,
			pages: reading.books_data.pages,
			imageURL: reading.books_data.imageURL,
			current_page: reading.current_page,
			time_spent: reading.time_spent,
			comments: reading.comments,
			rating: reading.rating,
		};
	}

	doSubmit = () => {
		// Update reading into DB
		const reading = this.state.data;

		saveReading(reading);

		this.props.history.push("/readings");
	};

	render() {
		return (
			<>
				<div className="container">
					<div className="row">
						<div className="col-lg-6 col-sm-12 left">
							<h1>{strings.reading_details}</h1>
							<form onSubmit={this.handleSubmit}>
								{this.renderOutput("title", strings.title)}
								{this.renderOutput("description", strings.description)}
								{this.renderOutput("author", strings.author)}
								{this.renderOutput("ISBN", strings.ISBN)}
								{this.renderOutput("pages", strings.pages, "number")}
								{this.renderInputNumber("current_page", strings.current_page)}
								{this.renderInputNumber("time_spent", strings.time_spent)}
								{this.renderRating("rating", strings.rating)}
								{this.renderInput("comments", strings.comments)}
								{this.renderButton(strings.save)}
							</form>
							<div>
								<br />
							</div>
							<div>
								<br />
							</div>
						</div>
						<div className="col-lg-6 col-sm-12 right">
							<img
								style={{ height: "auto", maxWidth: "300px" }}
								src={this.state.data.imageURL}
								alt=""
							/>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default ReadingForm;
