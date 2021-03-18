import React, { Component } from "react";
import { Link } from "react-router-dom";

import auth from "../services/authService";
import Table from "./common/table";

class BooksTable extends Component {
	columns = [
		{
			path: "imageURL",
			content: (book) => (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<img
						style={{ height: "auto", maxWidth: "50px" }}
						alt=""
						src={book.imageURL}
					/>
				</div>
			),
		},
		{
			path: "title",
			label: "Title",
			content: (book) => <Link to={`/books/${book._id}`}>{book.title}</Link>,
		},
		{ path: "author", label: "Author" },
		{ path: "ISBN", label: "ISBN" },
		{ path: "description", label: "Description" },
		{ path: "pages", label: "Pages" },
	];

	addReadingColumn = {
		key: "addReading",
		content: (book) => (
			<button
				onClick={() => this.props.onAddReading(book)}
				className="btn btn-secondary btn-sm"
			>
				Read this
			</button>
		),
	};

	deleteColumn = {
		key: "delete",
		content: (book) => (
			<button
				onClick={() => this.props.onDelete(book)}
				className="btn btn-danger btn-sm"
			>
				Delete
			</button>
		),
	};

	constructor() {
		super();
		const user = auth.getCurrentUser();
		if (user) this.columns.push(this.addReadingColumn);
		if (user && user.isAdmin) this.columns.push(this.deleteColumn);
	}

	render() {
		const { books, sortColumn, onSort } = this.props;

		return (
			<Table
				columns={this.columns}
				data={books}
				sortColumn={sortColumn}
				onSort={onSort}
			/>
		);
	}
}

export default BooksTable;
