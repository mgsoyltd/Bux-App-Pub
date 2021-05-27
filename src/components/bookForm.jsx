import React from "react";
import Joi from "joi";
import { getBook, saveBook } from "../services/bookService";
import Form from "./common/form";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import strings from "../services/textService";
import UploadImage from "./imagePopup";
import {
	uploadImageSigned,
	destroyImageSigned,
} from "../services/imageService";
// import arrayBufferToBase64, { base64Flag } from "../utils/arrayBufferToBase64";

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
		public_id: Joi.string().empty(""),
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
			}

			// else if (book.image) {
			// 	// Image loaded from Bux API database
			// 	let imageStr = arrayBufferToBase64(book.image.data.data);
			// 	const img = base64Flag + imageStr;
			// 	this.setState({ img: img });
			// }
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
			public_id: book.public_id || "",
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

			toast.success(strings.upload_image);

			// Destroy existing image
			if (book.imageURL) {
				await destroyImageSigned(book.public_id);
			}

			// Upload image to the cloud
			const info = await uploadImageSigned(this.state.imageData);
			if (info) {
				// console.log("<<INFO>>", info.url, info.public_id);
				book.imageURL = info.url; // Save URL on a book
				book.public_id = info.public_id; // Save public_id on a book
				this.setState({ img: info.url }); // Show the image
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
