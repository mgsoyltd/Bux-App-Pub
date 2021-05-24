import React from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

import strings from "../services/textService";
import logo from "../mgs_logo.svg";
import Form from "./common/form";
import auth from "../services/authService";

class LoginForm extends Form {
	state = {
		data: { email: "", password: "" },
		errors: {},
	};

	schema = Joi.object({
		email: Joi.string().required().label("Email address"),
		password: Joi.string().required().label("Password"),
	});

	doSubmit = async () => {
		// Call the server
		try {
			const { email, password } = this.state.data;
			const res = await auth.login(email, password);
			if (res.request) {
				switch (res.request.status) {
					case 404:
						toast.error(strings.internal_error);
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
						const { state } = this.props.location;
						window.location = state ? state.from.pathname : "/readings";
						break;
					default:
						break;
				}
			}
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
		if (auth.isLoggedIn()) return <Redirect to="/readings" />;

		return (
			<div className="text-center">
				<main className="form-signin">
					<form onSubmit={this.handleSubmit}>
						<img
							className="mb-4 myimage"
							src={logo}
							alt="logo"
							width="50"
							height="50"
						/>
						<h1 className="h3 mb-3 fw-normal">{strings.login_title}</h1>
						<div className="form-floating">
							{this.renderInputPH("email", strings.user_email, true)}
						</div>
						<div className="form-floating">
							{this.renderInputPH(
								"password",
								strings.user_password,
								false,
								"password"
							)}
						</div>
						<div className="checkbox mb-3">
							<label>
								<input type="checkbox" value="remember-me" />{" "}
								{strings.remember_me}
							</label>
						</div>
						{this.renderButton(strings.login, "w-100 btn btn-lg btn-primary")}
					</form>
				</main>
			</div>
		);
	}
}

export default LoginForm;
