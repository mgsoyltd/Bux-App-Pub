import jwtDecode from "jwt-decode";

import http from "./httpService";

const apiEndpoint = "/auth";
const appName = process.env.REACT_APP_NAME;
const tokenKey = `${appName}_token`;
const apiKey = `${appName}_APIKey`;

const getJwt = () => {
	let jwt = localStorage.getItem(tokenKey);
	if (jwt === undefined) jwt = null;
	return jwt;
}

export const getApiKey = () => {
	let api = localStorage.getItem(apiKey);
	if (api === undefined) api = null;
	return api;
}

http.setHeaderJwt(getJwt());
http.setHeaderApiKey(getApiKey());

const login = async (email, password) => {
	const { data: jwt } = await http.post(apiEndpoint, { email, password });
	console.log(jwt);
	localStorage.setItem(tokenKey, jwt);
	http.setHeaderJwt(getJwt());
}

const loginWithJwt = (jwt, api) => {
	localStorage.setItem(tokenKey, jwt);
	localStorage.setItem(apiKey, api);
	http.setHeaderJwt(getJwt());
	http.setHeaderApiKey(getApiKey());
}

const logout = () => {
	localStorage.removeItem(tokenKey);
	localStorage.removeItem(apiKey);
	http.setHeaderJwt(getJwt());
	http.setHeaderApiKey(getApiKey());
}

const getCurrentUser = () => {
	try {
		const jwt = getJwt();
		const decoded = jwtDecode(jwt);
		console.log("Current user:", decoded);
		return decoded;
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

export default {
	login,
	loginWithJwt,
	logout,
	getCurrentUser,
	getCurrentAPIKey,
	getJwt,
	getApiKey
};
