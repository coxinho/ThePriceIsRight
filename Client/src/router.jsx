import React from 'react';
import './router.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';

import Login from './login';
import Register from './register';
import Search from './search';
import Share from './share';
import ManageSupermarkets from './manage-supermarkets';
import ManageUsers from './manage-users';
import Account from './account';
import ManageProduct from './manage-product';
import Snackbar from './snackbar';

class Router extends React.Component {
	// If the user is not logged in
	// Render login page (with link to register page)
	// Else
	// Render menu
	constructor(props) {
		super(props);
		/*this.state = {
			user: {},
			isLoggedIn: false
		};*/
		this.state = {
			user: {
				first: 'Cristina',
				last: 'Coxinho',
				email: 'cristina.coxinho@gmail.com',
				photo: 'https://cdn0.iconfinder.com/data/icons/elasto-online-store/26/00-ELASTOFONT-STORE-READY_user-circle-512.png',
				type: 'admin'
			},
			isLoggedIn: true,
			product: '',
			snackbarMessage: '',
			timeout: null
		};
	}

	render() {
		const loggedIn = this.state.isLoggedIn;
		//console.log(this.state);
		//console.log(this.props);
		return (
			<Container>
				<BrowserRouter>
					<Row className="justify-content-md-center">
						<Col lg="12">
							<header>
								<Link to="/">The Price Is Right</Link>
								{loggedIn && <Link to="/share">Share</Link>}
								{loggedIn && <Link to="/manage-supermarkets">Supermarkets</Link>}
								{loggedIn && <Link to="/manage-users">Users</Link>}
								{loggedIn && <Link to="/account">Account</Link>}
								{loggedIn && (
									<button href="#" onClick={() => this.logoutUser()}>
										Logout
									</button>
								)}
								{!loggedIn && <Link to="/login">Login / Register</Link>}
							</header>
						</Col>
					</Row>
					<Row>
						<Route exact path="/" render={props => <Search {...props} userType={this.state.user.type} setProduct={product => this.setProduct(product)} snackbarMessage={(msg) => this.snackbarMessage(msg)} />} />
						<Route path="/login" render={props => (loggedIn ? <Redirect to="/" /> : <Login {...props} login={user => this.loginUser(user)} snackbarMessage={(msg) => this.snackbarMessage(msg)} />)} />
						<Route path="/register" render={props => <Register {...props} snackbarMessage={(msg) => this.snackbarMessage(msg)} />} />
						<Route path="/share" render={props => (loggedIn ? <Share snackbarMessage={(msg) => this.snackbarMessage(msg)} /> : <Login {...props} login={user => this.loginUser(user)} />)} />
						<Route
							exact
							path="/manage-supermarkets"
							render={props => (loggedIn ? <ManageSupermarkets snackbarMessage={(msg) => this.snackbarMessage(msg)} /> : <Login {...props} login={user => this.loginUser(user)} />)}
						/>
						<Route
							exact
							path="/manage-users"
							render={props => (loggedIn ? <ManageUsers /> : <Login {...props} login={user => this.loginUser(user)} />)}
						/>
						<Route
							path="/account"
							render={props =>
								loggedIn ? (
									<Account {...props} user={this.state.user} update={user => this.updateUser(user)} delete={() => this.deleteUser()} />
								) : (
										<Redirect to="/" />
									)
							}
						/>
						<Route
							path="/product"
							render={props => {
								if (loggedIn && this.state.user.type === 'admin' && this.state.product !== '') {
									return <ManageProduct {...props} product={this.state.product} snackbarMessage={(msg) => this.snackbarMessage(msg)} />;
								} else {
									//console.log("You don't have permissions to access that page.");
									this.snackbarMessage("You don't have permissions to access that page or a product to manage wasn't selected.");
									return <Redirect to="/" />;
								}
							}}
						/>
					</Row>
				</BrowserRouter>
				<Snackbar message={this.state.snackbarMessage} />
			</Container>
		);
	}

	loginUser(user) {
		this.setState({ user: user, isLoggedIn: true });
		this.snackbarMessage('Login successful!');
	}

	logoutUser() {
		// Ask server to logout

		// Change state
		this.setState({ user: {}, isLoggedIn: false });
		this.snackbarMessage('Logout successful!');
	}

	updateUser(user) {
		// Send user update info to server

		// Get reply
		const reply = {
			status: 'OK',
			user: user
		};

		this.setState({ user: reply.user });
		this.snackbarMessage(`The user ${this.state.user.first} ${this.state.user.last} was updated!`);
	}

	deleteUser() {
		const first = this.state.user.first;
		const last = this.state.user.last;
		// Send 'delete user' to server
		// If the deleted user was me, logout
		this.snackbarMessage(`The user ${first} ${last} was deleted!`);
	}

	setProduct(product) {
		//console.log('EAN no router: ' + ean);
		this.setState({ product: product });
		//this.state.history.push('/product');
	}

	snackbarMessage(msg) {
		this.setState({ snackbarMessage: msg });
		clearTimeout(this.state.time);
		this.setState({
			time: setTimeout(() => {
				this.setState({ snackbarMessage: '' });
			}, 4000)
		});
	}
}

export default Router;
