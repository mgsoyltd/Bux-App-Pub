import React, { Component } from "react";
import { Link } from "react-router-dom";

import auth from "../services/authService";
import Table from "./common/table";
import FormatDate from "./common/date";
import strings from "../services/textService";

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
			label: strings.title,
			content: (reading) => (
				<Link to={`/readings/${reading._id}`}>{reading.books_data.title}</Link>
			),
		},
		{
			path: "author",
			label: strings.author,
			content: (reading) => reading.books_data.author,
		},
		{
			path: "ISBN",
			label: strings.ISBN,
			content: (reading) => reading.books_data.ISBN,
		},
		{
			path: "description",
			label: strings.description,
			content: (reading) => reading.books_data.description,
		},
		{
			path: "pages",
			label: strings.pages,
			content: (reading) => reading.books_data.pages,
		},
		{
			path: "current_page",
			label: strings.current_page,
			content: (reading) => reading.current_page,
		},
		{
			path: "time_spent",
			label: strings.time_spent,
			content: (reading) => reading.time_spent,
		},
		{
			path: "rating",
			label: strings.rating,
			content: (reading) => reading.rating,
		},
		{
			path: "comments",
			label: strings.comments,
			content: (reading) => reading.comments,
		},
		{
			path: "updatedAt",
			label: strings.last_update,
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
				{strings.delete}
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
