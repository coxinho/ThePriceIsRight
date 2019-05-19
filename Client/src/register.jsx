import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

class Register extends React.Component {
	render() {
		return (
			<Container>
				<Row>
					<Form.Control type="text" placeholder="Insert email" id="email" /*onChange={e => this.validate(e)}*/ />
				</Row>
				<Row>
					<Form.Control type="password" placeholder="Insert your password" id="pw" />
				</Row>
				<Row>
					<Form.Control type="password" placeholder="Retype your password" id="pw2" />
				</Row>
				<Row>
					<Button variant="primary" type="submit" onClick={() => this.register()}>
						Register
					</Button>
				</Row>
				<Row>
					<Link to="/login">Login</Link>
				</Row>
			</Container>
		);
	}

	register() {
		//const email = $('#email').val();
		//const pw = $('#pw').val();
		//const pw2 = $('#pw2').val();

		// Ask the server is this user and password match

		// Server reply
		const reply = {
			status: 'OK'
		};

		// If server answer with OK
		if (reply.status === 'OK') {
			this.props.history.push('/login');
			// Show message
			//console.log('Registration successful!');
			this.props.snackbarMessage('Registration successful!');

		} else {
			//console.log('That email is already in use!');
			this.props.snackbarMessage('That email is already in use!');
		}
	}

	/*validate(e) {
		e.style.border = e.target.value == '' ? 'solid red' : 'none';
	}*/
}

export default Register;
