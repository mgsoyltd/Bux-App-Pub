import axios from "axios";
import { toast } from "react-toastify";
import logger from "./logService";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// Common error handling
axios.interceptors.response.use(null, (error) => {
	const expectedError =
		error.response &&
		error.response.status >= 400 &&
		error.response.status < 500;

	if (!expectedError) {
		logger.log(error);
		toast.error("An unexpected error occurred. Server may be down.");
	}

	return Promise.reject(error);
});

function setHeaderJwt(jwt) {
	axios.defaults.headers.common["Authorization"] = jwt;
}

function setHeaderApiKey(apikey) {
	axios.defaults.headers.common["x-api-key"] = apikey;
}

function getHeaderApiKey(apikey) {
	axios.defaults.headers.common["x-api-key"] = apikey;
}

const testBooks = async () => {

	const bookData = await axios
		.get('/books')
		.then(({ data }) => {
			// handle success
			console.log(data);
			return data;
		})
		.catch(err => {
			// handle error
			console.error(err);
		});

	const books = JSON.stringify(bookData, null, 2);
	console.log(books);

	return books;
}

const http = {
	get: axios.get,
	post: axios.post,
	put: axios.put,
	delete: axios.delete,
	setHeaderJwt,
	setHeaderApiKey,
	getHeaderApiKey,
	testBooks
};

export default http;