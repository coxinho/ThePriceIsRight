import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import $ from 'jquery';

class Account extends React.Component {
	render() {
		return (
			<Container>
				<Row>
					<Col lg="8">
						<Form.Control type="text" placeholder={this.props.user.first} id="first" />
						<Form.Control type="text" placeholder={this.props.user.last} id="last" />
						<Form.Control type="email" placeholder={this.props.user.email} id="email" />
						<Form.Control type="password" placeholder="Insert password" id="pw" />
						<Form.Control type="password" placeholder="Retype password" id="pw2" />
					</Col>
					<Col lg="4">
						<Image src={this.props.user.photo} rounded fluid id="photo" />
					</Col>
				</Row>
				<Row>
					<Button variant="primary" type="submit" onClick={() => this.update()}>
						Update profile
					</Button>
				</Row>
				<Row>
					<Button variant="danger" type="submit" onClick={() => this.delete()}>
						Delete account
					</Button>
				</Row>
			</Container>
		);
	}

	update() {
		const user = {
			first: $('#first').val(),
			last: $('#last').val(),
			email: $('#email').val(),
			photo: $('#photo').attr('src')
		};

		// Send this user to the parent (Router)
		this.props.update(user);
	}

	delete() {
		this.props.delete();
	}
}

export default Account;
