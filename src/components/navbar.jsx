import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = ({ user }) => {
	const [isNavCollapsed, setIsNavCollapsed] = useState(true);

	const handleNavCollapse = () => {
		console.log("handleNavCollapse");
		setIsNavCollapsed(!isNavCollapsed);
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
			<Link className="navbar-brand" to="/">
				<h1>Books Reading Goals</h1>
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
						Readings
					</NavLink>
					<NavLink className="nav-item nav-link" to="/books">
						Books
					</NavLink>
					{!user && (
						<React.Fragment>
							<NavLink className="nav-item nav-link" to="/login">
								Login
							</NavLink>
							<NavLink className="nav-item nav-link" to="/register">
								Register
							</NavLink>
						</React.Fragment>
					)}
					{user && (
						<React.Fragment>
							<NavLink className="nav-item nav-link" to="/profile">
								{user.name}
							</NavLink>
							<NavLink className="nav-item nav-link" to="/logout">
								Logout
							</NavLink>
						</React.Fragment>
					)}
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
