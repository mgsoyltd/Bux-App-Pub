import React from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

import strings from "../services/textService";
import logo from "../mgs_logo.svg";
import Form from "./common/form";
import auth from "../services/authService";
import { sleep } from "./common/sleep";
import "../styles/spinner.css";

class LoginForm extends Form {
	state = {
		data: { email: "", password: "" },
		errors: {},
		loading: false,
	};

	schema = Joi.object({
		email: Joi.string().required().label("Email address"),
		password: Joi.string().required().label("Password"),
	});

	doSubmit = async () => {
		// Call the server
		try {
			this.loading = true;
			const { email, password } = this.state.data;
			const res = await auth.login(email, password);
			this.loading = false;
			if (res.request) {
				switch (res.request.status) {
					case 404:
						toast.error(strings.internal_error);
						break;
					case 403:
						toast.error(strings.too_many_attempts);
						break;
					case 401:
						toast.error(strings.access_denied);
						break;
					case 400:
						toast.error(strings.bad_request);
						break;
					case 200:
						// Display previous login date
						const { data: resp } = res;
						let doze = 0;
						if (resp.prevLogonTime !== undefined && resp.prevLogonTime) {
							doze = 2000;
							const date = new Date(resp.prevLogonTime);
							let langu = strings.getLanguage();
							let locale = "fi-FI";
							if (langu !== "fi") {
								locale = "en-US";
							}
							const greetings =
								strings.greetings +
								resp.name +
								" - " +
								strings.prev_logon_time +
								date.toLocaleDateString(locale) +
								" " +
								date.toLocaleTimeString(locale);
							toast(greetings, {
								position: "top-center",
								autoClose: doze,
								pauseOnFocusLoss: false,
							});
						}
						sleep(doze).then(() => {
							// Forward to a route
							const { state } = this.props.location;
							window.location = state ? state.from.pathname : "/readings";
						});
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
			if (
				ex.response &&
				(ex.response.status === 400 || // validation error
					ex.response.status === 401 || // Invalid email or password
					ex.response.status === 403 || // Too many invalid authentication attempts
					ex.response.status === 404) // Not found
			) {
				const errmsg = ex.response.data.msg;
				toast.error(errmsg);
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
						<div>
							<br />
						</div>
						<button
							disabled={this.validate()}
							className={"w-100 btn btn-lg btn-primary"}
						>
							{this.loading ? <div className="loader"></div> : strings.login}
						</button>
					</form>
				</main>
			</div>
		);
	}
}

export default LoginForm;
