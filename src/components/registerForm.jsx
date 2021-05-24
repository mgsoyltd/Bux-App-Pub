import React from "react";
import Joi from "joi";
import Form from "./common/form";
import * as userService from "../services/userService";
import { Redirect } from "react-router-dom";
import strings from "../services/textService";
import auth from "../services/authService";

class RegisterForm extends Form {
	state = {
		data: { name: "", username: "", password: "", isAdmin: false },
		errors: {},
	};

	schema = Joi.object({
		name: Joi.string().required().label("Name"),
		username: Joi.string().required().label("Username"),
		password: Joi.string().required().min(8).label("Password"),
	});

	doSubmit = async () => {
		try {
			await userService.register(this.state.data);
			// const response = await userService.register(this.state.data);
			// auth.loginWithJwt(response.headers["Authorization"]);
			// Require user to login manually
			window.location = "/";
		} catch (ex) {
			// Expected (404: not found, 400: bad request) - CLIENT ERRORS
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
		// Registering done by Admin for now...
		const user = auth.getCurrentUser();
		if (!user || (user && !user.isAdmin)) return <Redirect to="/" />;

		return (
			<div>
				<h1>{strings.register}</h1>
				<form onSubmit={this.handleSubmit}>
					{this.renderInput("name", strings.user_name)}
					{this.renderInput("username", strings.user_email)}
					{this.renderInput("password", strings.user_password, "password")}
					{this.renderButton(strings.register)}
				</form>
			</div>
		);
	}
}

export default RegisterForm;
