import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import * as userService from "../services/userService";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";
import strings from "../services/textService";

class RegisterForm extends Form {
	state = {
		data: { username: "", password: "", name: "", isAdmin: false },
		errors: {},
	};

	schema = {
		username: Joi.string().required().email().label("Username"),
		password: Joi.string().required().min(8).label("Password"),
		name: Joi.string().required().label("Name"),
	};

	doSubmit = async () => {
		try {
			const response = await userService.register(this.state.data);
			auth.loginWithJwt(response.headers["x-auth-token"]);
			window.location = "/";
		} catch (ex) {
			// Expected (404: not found, 400: bad request) - CLIENT ERRORS
			//	- Display a specific error message
			//
			// Unexpected (network down, server down, db down, bug)
			//	- Log them
			//	- Display a generic and friendly error message
			if (ex.response && ex.response.status === 400) {
				const errors = { ...this.state.errors };
				errors.username = ex.response.data;
				this.setState({ errors });
			}
		}
	};

	render() {
		const user = auth.getCurrentUser();
		// Registering done by Admin for now...
		if (!user || (user && !user.isAdmin)) return <Redirect to="/" />;

		return (
			<div>
				<h1>{strings.register}</h1>
				<form onSubmit={this.handleSubmit}>
					{this.renderInput("username", strings.user_email)}
					{this.renderInput("password", strings.user_password, "password")}
					{this.renderInput("name", strings.user_name)}
					{this.renderButton(strings.register)}
				</form>
			</div>
		);
	}
}

export default RegisterForm;
