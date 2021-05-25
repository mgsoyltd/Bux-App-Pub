import React, { useState } from "react";
import Joi from "joi";
import { getBook, saveBook } from "../services/bookService";
import Form from "./common/form";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import strings from "../services/textService";
import arrayBufferToBase64, { base64Flag } from "../utils/arrayBufferToBase64";
import UploadImage from "./imagePopup";
import { uploadImageSigned } from "../services/imageService";

class BookForm extends Form {
	state = {
		data: {
			book: null,
		},
		imageData: null,
		img: null,
		errors: {},
	};

	schema = Joi.object({
		_id: Joi.string(),
		title: Joi.string().max(255).required(),
		author: Joi.string().max(255).required(),
		ISBN: Joi.string().min(10).max(20).required(),
		description: Joi.string().empty(""),
		pages: Joi.number().greater(0),
		imageURL: Joi.string().empty(""), // !! Allow empty string !!
		image: Joi.allow(null),
		book: Joi.allow(null),
	});

	async populateBook() {
		try {
			const bookId = this.props.match.params.id;
			if (bookId === "new") return;
			const { data: book } = await getBook(bookId);
			this.setState({ data: this.mapToViewModel(book) });

			if (book.imageURL) {
				// Image from the cloud
				this.setState({ img: book.imageURL });
			} else if (book.image) {
				// Image loaded from Bux API database
				let imageStr = arrayBufferToBase64(book.image.data.data);
				const img = base64Flag + imageStr;
				this.setState({ img: img });
			}
		} catch (ex) {
			if (ex.request && ex.request.status === 404)
				this.props.history.replace("/not-found");
		}
	}

	async componentDidMount() {
		await this.populateBook();
	}

	mapToViewModel(book) {
		return {
			_id: book._id,
			title: book.title,
			author: book.author,
			ISBN: book.ISBN,
			description: book.description || "",
			pages: book.pages,
			imageURL: book.imageURL || "",
			image: book.image,
		};
	}

	doSubmit = async () => {
		// Update book into DB
		const book = this.state.data;
		let fdImage = null;
		// console.log(this.state);
		if (this.state.imageData) {
			// Upload image to Bux API database - DEPRECATED
			// fdImage = new FormData();
			// fdImage.append("file", this.state.imageData, this.state.imageData.name);

			// Upload image to the cloud
			const url = await uploadImageSigned(this.state.imageData);
			if (url) {
				book.imageURL = url; // Save URL on a book
				this.setState({ img: url }); // Show the image
			}
		}

		const res = await saveBook(book, fdImage);
		if (res.request) {
			switch (res.request.status) {
				case 403:
					toast.error(strings.access_denied);
					break;
				case 401:
					toast.error(strings.access_denied);
					break;
				case 400:
					toast.error(strings.bad_request + res.request.response);
					break;
				case 200:
					toast.success(strings.book_saved);
					this.props.history.push("/books");
					break;
				default:
					break;
			}
		}
	};

	render() {
		return (
			<>
				<div className="container">
					<div className="row">
						<div className="col-lg-6 col-sm-12 left">
							<h1>{strings.book_details}</h1>
							<form onSubmit={this.handleSubmit}>
								{this.renderInput("title", strings.title)}
								{this.renderInput("description", strings.description)}
								{this.renderInput("author", strings.author)}
								{this.renderInput("ISBN", strings.ISBN)}
								{this.renderInput("pages", strings.pages)}
								{this.renderButton(strings.save)}
							</form>
							<div>
								<br />
							</div>
							<form>
								<UploadImage data={this.state} />
							</form>
							<div>
								<br />
							</div>
						</div>
						<div className="col-lg-6 col-sm-12 right">
							<img
								style={{ height: "auto", maxWidth: "300px" }}
								src={this.state.img}
								alt=""
							/>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default BookForm;
