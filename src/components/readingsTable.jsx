import React, { Component } from "react";
import { Link } from "react-router-dom";

import auth from "../services/authService";
import Table from "./common/table";
import FormatDate from "./common/date";

class ReadingsTable extends Component {
	columns = [
		{
			path: "imageURL",
			content: (reading) => (
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
						src={reading.books_data.imageURL}
					/>
				</div>
			),
		},
		{
			path: "title",
			label: "Title",
			content: (reading) => (
				<Link to={`/readings/${reading._id}`}>{reading.books_data.title}</Link>
			),
		},
		{
			path: "author",
			label: "Author",
			content: (reading) => reading.books_data.author,
		},
		{
			path: "ISBN",
			label: "ISBN",
			content: (reading) => reading.books_data.ISBN,
		},
		{
			path: "description",
			label: "Description",
			content: (reading) => reading.books_data.description,
		},
		{
			path: "pages",
			label: "Pages",
			content: (reading) => reading.books_data.pages,
		},
		{
			path: "current_page",
			label: "Current page",
			content: (reading) => reading.current_page,
		},
		{
			path: "time_spent",
			label: "Time spent",
			content: (reading) => reading.time_spent,
		},
		{
			path: "rating",
			label: "Rating",
			content: (reading) => reading.rating,
		},
		{
			path: "comments",
			label: "Comments",
			content: (reading) => reading.comments,
		},
		{
			path: "updatedAt",
			label: "Last update",
			content: (reading) => <FormatDate date={reading.updatedAt} />,
		},
	];

	deleteColumn = {
		key: "delete",
		content: (reading) => (
			<button
				onClick={() => this.props.onDelete(reading)}
				className="btn btn-danger btn-sm"
			>
				Delete
			</button>
		),
	};

	constructor() {
		super();
		const user = auth.getCurrentUser();
		if (user) this.columns.push(this.deleteColumn);
	}

	render() {
		const { readings, sortColumn, onSort } = this.props;

		return (
			<Table
				columns={this.columns}
				data={readings}
				sortColumn={sortColumn}
				onSort={onSort}
			/>
		);
	}
}

export default ReadingsTable;
