import React from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import "bootstrap/dist/css/bootstrap.min.css";

import logo from "../mgs_logo.svg";

import Form from "./common/form";
import auth from "../services/authService";

class LoginForm extends Form {
	state = {
		data: { email: "", password: "" },
		errors: {},
	};

	schema = {
		email: Joi.string().required().label("Email address"),
		password: Joi.string().required().label("Password"),
	};

	doSubmit = async () => {
		// Call the server
		try {
			const { email, password } = this.state.data;
			await auth.login(email, password);
			const { state } = this.props.location;
			window.location = state ? state.from.pathname : "/";
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
		if (auth.getCurrentUser()) return <Redirect to="/" />;

		return (
			<div className="text-center">
				<main className="form-signin">
					<form onSubmit={this.handleSubmit}>
						<img className="mb-4" src={logo} alt="" width="72" height="57" />
						<h1 className="h3 mb-3 fw-normal">Please sign in</h1>
						{this.renderInputPH("email", "Email Address *", true)}
						{this.renderInputPH("password", "Password *", false, "password")}
						<div className="checkbox mb-3">
							<label>
								<input type="checkbox" value="remember-me" /> Remember me
							</label>
						</div>
						{this.renderButton("Sign in", "w-100 btn btn-lg btn-primary")}
					</form>
				</main>
			</div>
		);
	}
}

export default LoginForm;
