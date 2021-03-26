import React, { Component } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import { toast } from "react-toastify";

import { getBooks, deleteBook } from "../services/bookService";
import { getReadings, saveReading } from "../services/readingsService";
import BooksTable from "./booksTable";
import Pagination from "./common/pagination";
import SearchBox from "./common/searchBox";
import { paginate } from "../utils/paginate";
import auth from "../services/authService";
import strings from "../services/textService";
import arrayBufferToBase64, { base64Flag } from "../utils/arrayBufferToBase64";

class Books extends Component {
	state = {
		books: [],
		currentPage: 1,
		pageSize: 10,
		searchQuery: "",
		sortColumn: { path: "title", order: "asc" },
		isFetchingData: false,
	};

	componentDidMount() {
		this.setState({ isFetchingData: true });
		getBooks()
			.then(({ data: bookData }) => {
				let booksArray = [...bookData];
				// console.log(booksArray);
				booksArray.map((book) => {
					// console.log(book);
					if (book.image) {
						let imageStr = arrayBufferToBase64(book.image.data.data);
						book.img = base64Flag + imageStr;
					}
					return book;
				});
				this.setState({ books: booksArray, isFetchingData: false });
			})
			.catch((ex) => {
				this.setState({ isFetchingData: false });
				console.log("READ FAILURE:", ex);
				if (ex.request) {
					switch (ex.request.status) {
						case 403:
							toast.error(strings.access_denied);
							break;
						case 401:
							toast.error(strings.access_denied);
							break;
						case 400:
							toast.error(strings.bad_request);
							break;
						default:
							break;
					}
				}
			});
	}

	handleDelete = async (book) => {
		const originalBooks = this.state.books;
		const books = originalBooks.filter((m) => m._id !== book._id);
		this.setState({ books });
		try {
			const res = await deleteBook(book._id);
			if (res.request) {
				switch (res.request.status) {
					case 404:
						toast.error(strings.book_already_deleted);
						break;
					case 403:
						toast.error(strings.access_denied);
						break;
					case 401:
						toast.error(strings.access_denied);
						break;
					case 400:
						toast.error(strings.bad_request);
						break;
					case 200:
						toast.success(strings.book_deleted);
						break;
					default:
						break;
				}
			}
		} catch (ex) {
			// Expected (404: not found, 400: bac request) - CLIENT ERRORS
			//	- Display a specific error message
			//
			// Unexpected (network down, server down, db down, bug)
			//	- Log them
			//	- Display a generic and friendly error message
			if (ex.request) {
				switch (ex.request.status) {
					case 404:
						toast.error(strings.book_already_deleted);
						break;
					case 403:
						toast.error(strings.access_denied);
						break;
					case 401:
						toast.error(strings.access_denied);
						break;
					case 400:
						toast.error(strings.bad_request);
						break;

					default:
						break;
				}
			}
			// Rollback
			this.setState({ books: originalBooks });
		}
	};

	handleAddReading = async (book) => {
		try {
			const user = auth.getCurrentUser();
			const { data: readings } = await getReadings();
			// console.log("<<<READINGS>>", readings);
			if (readings) {
				var reading = _.result(
					_.find(readings, (obj) => {
						return obj.books_id === book._id && obj.users_id === user._id;
					}),
					"books_id"
				);
				if (!reading) {
					console.log("ADD NEW READING");
					reading = {
						users_id: user._id,
						books_id: book._id,
						current_page: 0,
						time_spent: 0,
						rating: 0,
						comments: "",
					};
					// console.log("<<<SAVE READING>>>", reading);
					await saveReading(reading);
					toast.success(strings.reading_added);
				}
				// Goto Readings page
				this.props.history.push("/readings");
			}
			// book._id
		} catch (ex) {
			// Expected (404: not found, 400: bac request) - CLIENT ERRORS
			//	- Display a specific error message
			//
			// Unexpected (network down, server down, db down, bug)
			//	- Log them
			//	- Display a generic and friendly error message
			if (ex.request && ex.request.status === 403)
				toast.error(strings.access_denied);
			else if (ex.request && ex.request.status === 400)
				toast.error("Bad request");
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
			books: allBooks,
		} = this.state;

		let filtered = allBooks;
		if (searchQuery)
			filtered = allBooks.filter((m) =>
				m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
			);

		const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

		const books = paginate(sorted, currentPage, pageSize);

		return { totalCount: filtered.length, data: books };
	};

	render() {
		// const { length: count } = this.state.books;
		const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
		const { user } = this.props;
		// if (count === 0) return <p>There are no books in the database</p>;

		const { totalCount, data: books } = this.getPagedData();

		return (
			<div className="container">
				<div className="row">
					<div className="col">
						{user && (
							<Link
								to="/books/new"
								className="btn btn-primary"
								style={{ marginBottom: 20 }}
							>
								{strings.new_book}
							</Link>
						)}
						<p>
							{strings.showing} {totalCount} {strings.books_in_db}
						</p>
						<SearchBox value={searchQuery} onChange={this.handleSearch} />
						<BooksTable
							books={books}
							sortColumn={sortColumn}
							onDelete={this.handleDelete}
							onSort={this.handleSort}
							onAddReading={this.handleAddReading}
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

export default Books;
