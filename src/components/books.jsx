import React, { Component } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import { toast } from "react-toastify";

import { getBooks, deleteBook } from "../services/bookService";
import BooksTable from "./booksTable";
import BookForm from "./bookForm";
import Pagination from "./common/pagination";
// import ListGroup from "./common/listGroup";
import SearchBox from "./common/searchBox";
import { paginate } from "../utils/paginate";

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
				const booksArray = [...bookData];
				console.log(booksArray);
				this.setState({ books: booksArray, isFetchingData: false });
			})
			.catch((err) => {
				console.log("READ FAILURE:", err);
				this.setState({ isFetchingData: false });
			});
		// const { data: bookData } = getBooks();
		// const books = [...bookData];
		// this.setState({ books });
	}

	handleDelete = async (book) => {
		const originalBooks = this.state.books;
		const books = originalBooks.filter((m) => m._id !== book._id);
		this.setState({ books });
		try {
			await deleteBook(book._id);
		} catch (ex) {
			// Expected (404: not found, 400: bac request) - CLIENT ERRORS
			//	- Display a specific error message
			//
			// Unexpected (network down, server down, db down, bug)
			//	- Log them
			//	- Display a generic and friendly error message
			if (ex.request && ex.request.status === 404)
				toast.error("This books has already been deleted.");
			else if (ex.request && ex.request.status === 403)
				toast.error("Access denied.");
			else if (ex.request && ex.request.status === 400)
				toast.error("Bad request");

			// Rollback
			this.setState({ books: originalBooks });
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
								New Book
							</Link>
						)}
						<p>Showing {totalCount} books in the database.</p>
						<SearchBox value={searchQuery} onChange={this.handleSearch} />
						<BooksTable
							books={books}
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

export default Books;
