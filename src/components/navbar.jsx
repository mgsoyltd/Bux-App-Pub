import React, { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AppContext } from "../appContext";
import strings from "../services/textService";

const NavBar = ({ user }) => {
	const [state, setState] = useContext(AppContext);
	const [isNavCollapsed, setIsNavCollapsed] = useState(true);

	strings.setLanguage(state.language); // Set default language

	const handleNavCollapse = () => {
		console.log("handleNavCollapse");
		setIsNavCollapsed(!isNavCollapsed);
	};

	const handleLanguageChange = (e) => {
		e.preventDefault();
		let lang = e.target.value;
		setState((state) => ({ ...state, language: lang }));
		// window.location = "/";
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
			<Link className="navbar-brand" to="/">
				<h1>{strings.app_title}</h1>
			</Link>
			<button
				className="navbar-toggler"
				type="button"
				data-toggle="collapse"
				data-target="#navbarNavAltMarkup"
				aria-controls="navbarNavAltMarkup"
				aria-expanded={!isNavCollapsed ? true : false}
				aria-label="Toggle navigation"
				onClick={handleNavCollapse}
			>
				<span className="navbar-toggler-icon"></span>
			</button>
			<div
				className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse`}
				id="navbarNavAltMarkup"
			>
				<div className="navbar-nav">
					<NavLink className="nav-item nav-link" to="/readings">
						{strings.readings}
					</NavLink>
					<NavLink className="nav-item nav-link" to="/books">
						{strings.books}
					</NavLink>
					{!user && (
						<React.Fragment>
							<NavLink className="nav-item nav-link" to="/login">
								{strings.login}
							</NavLink>
						</React.Fragment>
					)}
					{user && (
						<React.Fragment>
							<NavLink className="nav-item nav-link" to="/profile">
								{user.name}
							</NavLink>
							<NavLink className="nav-item nav-link" to="/logout">
								{strings.logout}
							</NavLink>
						</React.Fragment>
					)}
					{user && user.isAdmin && (
						<React.Fragment>
							<NavLink className="nav-item nav-link" to="/register">
								{strings.register}
							</NavLink>
						</React.Fragment>
					)}
					<div className="btn-group btn-sm">
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<select onChange={handleLanguageChange}>
							<option value="fi">FI - Finnish</option>
							<option value="en">EN - English</option>
						</select>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
