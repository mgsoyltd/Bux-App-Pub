import React, { useState } from "react";
import Joi from "joi-browser";
import { getBook, saveBook } from "../services/bookService";
import Form from "./common/form";
import ImageUpload from "./common/imageUpload";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import strings from "../services/textService";

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
			imageURL: book.imageURL || "",
		};
	}

	doSubmit = async () => {
		// Update book into DB
		const book = this.state.data;
		let fdImage = null;
		if (this.state.imageData) {
			fdImage = new FormData();
			fdImage.append("file", this.state.imageData, this.state.imageData.name);
		}

		const res = await saveBook(book, fdImage);
		if (res.request) {
			switch (res.request.status) {
				case 403:
					toast.error("Access denied.");
					break;
				case 401:
					toast.error("Access denied.");
					break;
				case 400:
					toast.error("Bad request " + res.request.response);
					break;
				case 200:
					toast.error("Book saved successfully.");
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
				{strings.upload_image}
			</Button>

			<Modal
				show={show}
				onHide={handleCancel}
				backdrop="static"
				keyboard={false}
			>
				<Modal.Header closeButton>
					<Modal.Title>{strings.upload_image}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ImageUpload onSelectImage={selectedImages} />
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCancel}>
						{strings.cancel}
					</Button>
					<Button variant="primary" onClick={handleUseImage}>
						{strings.use_image}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default BookForm;
