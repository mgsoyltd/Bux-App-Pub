import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NavBar from "./components/navbar";
import NotFound from "./components/notFound";
import Readings from "./components/readings";
import ReadingsForm from "./components/readingsForm";
import Books from "./components/books";
import BookForm from "./components/bookForm";
import LoginForm from "./components/loginForm";
import Logout from "./components/logout";
import RegisterForm from "./components/registerForm";
import ProfileForm from "./components/profile";
import ProtectedRoute from "./components/common/protectedRoute";
import auth from "./services/authService";

const App = () => {

	const user = auth.getCurrentUser();

	return (
		<React.Fragment>
			<ToastContainer />
			<NavBar user={user} />
			<main className="container">
				<Switch>
					<Route path="/new" component={BookForm} />
					<Route path="/profile" component={ProfileForm} />
					<Route path="/register" component={RegisterForm} />
					<Route path="/login" component={LoginForm} />
					<Route path="/logout" component={Logout} />
					<ProtectedRoute path="/books/:id" component={BookForm} />
					<Route
						path="/books"
						render={(props) => <Books {...props} user={user} />}
					/>
					<ProtectedRoute path="/readings/:id" component={ReadingsForm} />
					<Route
						path="/readings"
						render={(props) => <Readings {...props} user={user} />}
					/>
					<Route path="/not-found" component={NotFound} />
					<Redirect exact from="/" to="/readings" />
					<Redirect to="/not-found" />
				</Switch>
			</main>
		</React.Fragment>
	);
}

export default App;
