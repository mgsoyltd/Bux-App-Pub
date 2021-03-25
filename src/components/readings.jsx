import React, { Component } from "react";
import _ from "lodash";
import { toast } from "react-toastify";

import { deleteReading, getReadingsByUser } from "../services/readingsService";
import ReadingsTable from "./readingsTable";
import Pagination from "./common/pagination";
import SearchBox from "./common/searchBox";
import { paginate } from "../utils/paginate";
import strings from "../services/textService";
import { base64Flag } from "../utils/arrayBufferToBase64";

class Readings extends Component {
	state = {
		readings: [],
		currentPage: 1,
		pageSize: 10,
		searchQuery: "",
		sortColumn: { path: "title", order: "asc" },
		isFetchingData: false,
	};

	componentDidMount() {
		this.setState({ isFetchingData: true });
		getReadingsByUser()
			.then(({ data: readingData }) => {
				const readingsArray = [...readingData];
				// console.log(readingsArray);
				readingsArray.map((reading) => {
					if (reading.books_data.image) {
						let imageStr = reading.books_data.image.data;
						reading.books_data.img = base64Flag + imageStr;
					}
					// console.log(reading);
					return reading;
				});
				this.setState({ readings: readingsArray });
			})
			.catch((err) => {
				console.log("READ FAILURE:", err);
			})
			.then(() => {
				this.setState({ isFetchingData: false });
			});
	}

	handleDelete = async (reading) => {
		const originalReadings = this.state.readings;
		const readings = originalReadings.filter((m) => m._id !== reading._id);
		this.setState({ readings });
		try {
			await deleteReading(reading._id);
			toast.success("Book deleted from the reading list.");
		} catch (ex) {
			// Expected (404: not found, 400: bac request) - CLIENT ERRORS
			//	- Display a specific error message
			//
			// Unexpected (network down, server down, db down, bug)
			//	- Log them
			//	- Display a generic and friendly error message
			if (ex.request && ex.request.status === 404)
				toast.error(strings.reading_already_deleted);
			else if (ex.request && ex.request.status === 403)
				toast.error(strings.access_denied);
			else if (ex.request && ex.request.status === 400)
				toast.error(strings.bad_request);

			// Rollback
			this.setState({ readings: originalReadings });
		}
	};

	handlePageChange = (page) => {
		this.setState({ currentPage: page });
	};

	handleSearch = (query) => {
		this.setState({ searchQuery: query, currentPage: 1 });
	};

	handleSort = (sortColumn) => {
		this.setState({ sortColumn });
	};

	getPagedData = () => {
		const {
			pageSize,
			currentPage,
			sortColumn,
			searchQuery,
			readings: allReadings,
		} = this.state;

		let filtered = allReadings;
		if (searchQuery)
			filtered = allReadings.filter((m) =>
				m.books_data.title.toLowerCase().startsWith(searchQuery.toLowerCase())
			);

		const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

		const readings = paginate(sorted, currentPage, pageSize);

		return { totalCount: filtered.length, data: readings };
	};

	render() {
		// const { length: count } = this.state.readings;
		const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
		// const { user } = this.props;
		// if (count === 0) return <p>There are no readings in the database</p>;

		const { totalCount, data: readings } = this.getPagedData();

		return (
			<div className="container">
				<div className="row">
					<div className="col">
						<p>
							{strings.showing} {totalCount} {strings.readings_in_db}
						</p>
						<SearchBox value={searchQuery} onChange={this.handleSearch} />
						<ReadingsTable
							readings={readings}
							sortColumn={sortColumn}
							onDelete={this.handleDelete}
							onSort={this.handleSort}
						/>
						<Pagination
							itemsCount={totalCount}
							pageSize={pageSize}
							currentPage={currentPage}
							onPageChange={this.handlePageChange}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Readings;
