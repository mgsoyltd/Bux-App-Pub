import React, { useState } from "react";
import Joi from "joi-browser";
import { getBook, saveBook } from "../services/bookService";
import Form from "./common/form";
import ImageUpload from "./common/imageUpload";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

class BookForm extends Form {
	state = {
		data: {
			book: null,
		},
		imageData: null,
		errors: {},
	};

	schema = {
		_id: Joi.string(),
		title: Joi.string().max(255).required(),
		author: Joi.string().max(255).required(),
		ISBN: Joi.string().min(10).max(20).required(),
		description: Joi.string().empty(""),
		pages: Joi.number().empty(""),
		imageURL: Joi.string().empty(""), // !! Allow empty string !!
		book: Joi.allow(null),
	};

	async populateBook() {
		try {
			const bookId = this.props.match.params.id;
			if (bookId === "new") return;
			const { data: book } = await getBook(bookId);
			this.setState({ data: this.mapToViewModel(book) });
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
			imageURL: book.imageURL,
		};
	}

	doSubmit = () => {
		// Update book into DB
		const book = this.state.data;
		let fdImage = null;
		if (this.state.imageData) {
			fdImage = new FormData();
			fdImage.append("file", this.state.imageData, this.state.imageData.name);
		}

		saveBook(book, fdImage);

		this.props.history.push("/books");
	};

	render() {
		return (
			<>
				<div className="container">
					<div className="row">
						<div class="col-lg-6 col-sm-12 left">
							<h1>Book Details</h1>
							<form onSubmit={this.handleSubmit}>
								{this.renderInput("title", "Title")}
								{this.renderInput("description", "Description")}
								{this.renderInput("author", "Author")}
								{this.renderInput("ISBN", "ISBN")}
								{this.renderInput("pages", "Pages")}
								{this.renderButton("Save")}
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
						<div class="col-lg-6 col-sm-12 right">
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

const UploadImage = (data) => {
	const [show, setShow] = useState(false);

	const handleShow = () => setShow(true);

	const handleCancel = () => {
		setShow(false);
		selectedImages([]);
	};

	const handleUseImage = () => {
		setShow(false);
	};

	const selectedImages = (images) => {
		console.log("<<<selectedImages>>>", images);
		data.data.imageData = images[0];
		console.log("<<<BOOK>>>", data);
	};

	return (
		<>
			<Button variant="secondary" onClick={handleShow}>
				Upload image
			</Button>

			<Modal
				show={show}
				onHide={handleCancel}
				backdrop="static"
				keyboard={false}
			>
				<Modal.Header closeButton>
					<Modal.Title>Upload image</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ImageUpload onSelectImage={selectedImages} />
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCancel}>
						Cancel
					</Button>
					<Button variant="primary" onClick={handleUseImage}>
						Use image
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default BookForm;
