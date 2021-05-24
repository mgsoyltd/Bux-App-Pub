import React from "react";
import Joi from "joi";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { Redirect } from "react-router-dom";

import Form from "./common/form";
import auth from "../services/authService";
import { currentUser, saveUser } from "../services/userService";
import { sleep } from "./common/sleep";
import strings from "../services/textService";

class ProfileForm extends Form {
	state = {
		data: {
			name: "",
			email: "",
			password: "",
			newpass: "",
		},
		errors: {},
		isLoading: true,
	};

	schema = Joi.object({
		name: Joi.string().required().label("Name"),
		email: Joi.string().required().label("Email address"),
		password: Joi.string().required().label("Current password"),
		newpass: Joi.string().empty("").label("New password"),
	});

	componentDidMount() {
		this.state.isLoading = true;
		currentUser()
			.then((user) => {
				// console.log("<<profile:componentDidMount>>", user);
				if (user) {
					delete user.iat;
				}
				// console.log("<<<USER>>>", this.state.data);
				this.setState({ data: user, isLoading: false });
			})
			.catch((ex) => {
				console.log(ex);
				if (ex.response && ex.response.status === 404) {
					const errors = { ...this.state.errors };
					this.setState({ errors });
				}
			});
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
		if (this.state.isLoading) {
			return <h1>Loading...</h1>;
		}
		const user = this.state.data;
		// console.log("<<profile:render>>", user);
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
