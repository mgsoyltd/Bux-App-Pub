import http from "./httpService";
import moment from "moment";

const apiEndpoint = "/auth";
const tokenKey = "id_token";
const expireKey = "expires_at";
const apiKey = "id_APIKey";
const userKey = "id_name";
const adminKey = "id_ia";

const getJwt = () => {
	let jwt = localStorage.getItem(tokenKey);
	if (jwt === undefined) jwt = null;
	return jwt;
}

const getApiKey = () => {
	let api = localStorage.getItem(apiKey);
	if (api === undefined) api = null;
	return api;
}

const getExpiration = () => {
	const expiration = localStorage.getItem(expireKey);
	if (expiration) {
		const expiresAt = JSON.parse(expiration);
		return moment(expiresAt);
	} else {
		return moment();
	}
}

http.setHeaderJwt(getJwt());
http.setHeaderApiKey(getApiKey());

const login = async (email, password) => {
	try {
		const res = await http.post(apiEndpoint, { email, password });
		if (res.request && res.request.status === 200) {

			const { data: jwt } = res;
			setLocalStorage(jwt, null);
		}
		return res;
	} catch (err) {
		return err;
	}
}

const setLocalStorage = (jwt, api) => {

	// Adds the expiration time defined on the JWT to the current moment
	const expiresAt = moment().add(Number.parseInt(jwt.expiresIn), 'days');

	localStorage.setItem(tokenKey, jwt.token);
	localStorage.setItem(expireKey, JSON.stringify(expiresAt.valueOf()));
	localStorage.setItem(userKey, jwt.name);
	if (jwt.isAdmin === undefined) {
		jwt.isAdmin = false;
	}
	localStorage.setItem(adminKey, jwt.isAdmin);

	http.setHeaderJwt(getJwt());

	if (api) {
		localStorage.setItem(apiKey, api);
		http.setHeaderApiKey(getApiKey());
	}
}

const isLoggedIn = () => {
	return moment().isBefore(getExpiration(), "second");
}

const isLoggedOut = () => {
	if (!isLoggedIn()) {

		return true;
	} else {
		return false;
	}
}

const loginWithJwt = (jwt, api) => {
	setLocalStorage(jwt, api);
}

const logout = () => {
	localStorage.removeItem(tokenKey);
	localStorage.removeItem(expireKey);
	localStorage.removeItem(apiKey);
	localStorage.removeItem(userKey);
	localStorage.removeItem(adminKey);

	http.setHeaderJwt(getJwt());
	http.setHeaderApiKey(getApiKey());
}

const getCurrentUser = () => {

	// Handle token expiration
	if (isLoggedOut()) {
		if (getJwt()) {
			logout();
		}
	}

	try {
		let user = null;
		const jwt = getJwt();
		if (jwt) {
			user = {
				token: jwt,
				name: localStorage.getItem(userKey),
				isAdmin: localStorage.getItem(adminKey)
			}
			// eslint-disable-next-line
			user.isAdmin = (user.isAdmin == "true");	// Truthy
		}
		// console.log("<<USER>>", user);
		return user;
	} catch (ex) {
		return null;
	}
}

const getCurrentAPIKey = () => {
	try {
		const apiKey = getApiKey();
		return apiKey;
	} catch (ex) {
		return null;
	}
}

const auth = {
	login,
	loginWithJwt,
	logout,
	getCurrentUser,
	getCurrentAPIKey,
	getJwt,
	getApiKey,
	isLoggedIn,
	isLoggedOut
};

export default auth;