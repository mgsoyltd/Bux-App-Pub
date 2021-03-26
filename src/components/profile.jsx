import React from "react";
import Joi from "joi";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { Redirect } from "react-router-dom";

import Form from "./common/form";
import auth from "../services/authService";
import { saveUser } from "../services/userService";
import { sleep } from "./common/sleep";
import strings from "../services/textService";

class ProfileForm extends Form {
	state = {
		data: {
			_id: "",
			name: "",
			email: "",
			password: "",
			newpass: "",
		},
		errors: {},
	};

	schema = Joi.object({
		_id: Joi.string().required(),
		name: Joi.string().required().label("Name"),
		email: Joi.string().required().label("Email address"),
		password: Joi.string().required().label("Old password"),
		newpass: Joi.string().empty("").label("New password"),
	});

	componentDidMount() {
		const user = auth.getCurrentUser();
		if (user) {
			delete user.iat;
		}
		this.setState({ data: user });
		// console.log("<<<USER>>>", this.state.data);
	}

	doSubmit = async () => {
		// Call the server
		try {
			const userdata = this.state.data;
			const res = await saveUser(userdata);
			if (res.request) {
				switch (res.request.status) {
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
						toast.success(strings.changes_saved);
						sleep(3000).then(() => {
							// Force new login
							auth.logout();
							window.location = "/login";
						});
						break;
					default:
						break;
				}
			}
		} catch (ex) {
			if (ex.response && ex.response.status === 400) {
				const errors = { ...this.state.errors };
				this.setState({ errors });
			}
		}
	};

	render() {
		const user = this.state.data;
		if (!user) return <Redirect to="/" />;

		return (
			<div className="text-center">
				<main className="form-signin">
					<form onSubmit={this.handleSubmit}>
						<h1 className="h3 mb-3 fw-normal">{user.name}</h1>
						{this.renderInputPH("name", strings.user_name, true)}
						{this.renderInputPH("email", strings.user_email, false)}
						{this.renderInputPH(
							"password",
							strings.user_pw_cur,
							false,
							"password"
						)}
						{this.renderInputPH(
							"newpass",
							strings.user_pw_new,
							false,
							"password"
						)}
						<br />
						{this.renderButton(strings.save, "w-100 btn btn-lg btn-primary")}
					</form>
				</main>
			</div>
		);
	}
}

export default ProfileForm;
