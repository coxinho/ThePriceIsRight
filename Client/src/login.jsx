import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import $ from 'jquery';

class Login extends React.Component {
	render() {
		return (
			<Container>
				<Row>
					<Form.Control type="text" placeholder="Insert username" id="username" /*onChange={e => this.validate(e)}*/ />
				</Row>
				<Row>
					<Form.Control type="password" placeholder="Insert your password" id="password" />
				</Row>
				<Row>
					<Button variant="primary" type="submit" onClick={() => this.login()}>
						Login
					</Button>
				</Row>
				<Row>
					<Link to="/register">Register</Link>
				</Row>
			</Container>
		);
	}

	login() {
		const user = $('#username').val();
		const pw = $('#password').val();

		if (user === '' || pw === '') {
			this.props.snackbarMessage('Username and password are empty!')
			return;
		}

		// Ask the server is this user and password match

		// Server reply
		const reply = {
			status: 'OK',
			user: {
				first: 'Cristina',
				last: 'Coxinho',
				email: 'cristina.coxinho@gmail.com',
				photo: 'https://cdn0.iconfinder.com/data/icons/elasto-online-store/26/00-ELASTOFONT-STORE-READY_user-circle-512.png',
				type: 'admin'
			}
		};

		// If server answer with OK
		reply.status === 'OK' ? this.props.login(reply.user) : this.props.snackbarMessage('Username and password are wrong!');
	}

	/*validate(e) {
		e.style.border = e.target.value == '' ? 'solid red' : 'none';
	}*/
}

export default Login;
