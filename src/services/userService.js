import http from "./httpService";

const apiEndPoint = "/users";

function getUserUrl(id) {
	return `${apiEndPoint}/${id}`;
}

function getMeUrl() {
	return `${apiEndPoint}/me`;
}

export const register = (user) => {
	return http.post(apiEndPoint, {
		name: user.name,
		email: user.username,
		password: user.password,
	});
}

export const currentUser = async () => {
	try {
		const res = await http.get(getMeUrl());
		// console.log("<<<CURRENT USER>>>", res.data.user);
		return res.data.user;
	}
	catch (err) {
		console.log("<<ERROR>>", err);
		return err;
	}
}

export const saveUser = async (user) => {
	// console.log("<<<SAVEUSER>>>", user);
	if (user._id) {
		// Update user data
		const body = { ...user };
		delete body._id;
		// console.log("<<<BODY>>>", body);
		try {
			const res = await http.put(getUserUrl(user._id), body);
			return res;
		}
		catch (err) {
			console.log("<<ERROR>>", err.response.status, err.message);
			return err;
		}
	}
}

