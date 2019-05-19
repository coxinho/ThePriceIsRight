import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import $ from 'jquery';

class ManageUsers extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			users: []
		};
	}

	render() {
		return (
			<Container>
				<Row>
					<Col lg="10">
						<Form.Control type="text" placeholder="Search for user" id="search" />
					</Col>
					<Col lg="2">
						<Button variant="primary" type="submit" onClick={() => this.search()}>
							Search
						</Button>
					</Col>
				</Row>
				{this.state.users.map(user => {
					return (
						<Row>
							{user.first} {user.last}
							<br />
							{user.email}
							<Image src={user.photo} rounded fluid />
						</Row>
					);
				})}
			</Container>
		);
	}

	search() {
		const term = $('#search').val();

		if (term === '') return;

		// Send search term to server

		// Reply
		const reply = {
			status: 'OK',
			users: [
				{
					first: 'Cristina',
					last: 'Coxinho',
					email: 'cristina.coxinho@gmail.com',
					photo: 'https://cdn0.iconfinder.com/data/icons/elasto-online-store/26/00-ELASTOFONT-STORE-READY_user-circle-512.png'
				},
				{
					first: 'João',
					last: 'Morgado',
					email: 'joao.morgado@gmail.com',
					photo: 'https://cdn0.iconfinder.com/data/icons/elasto-online-store/26/00-ELASTOFONT-STORE-READY_user-circle-512.png'
				},
				{
					first: 'António',
					last: 'Lopes',
					email: 'antonio.lopes@gmail.com',
					photo: 'https://cdn0.iconfinder.com/data/icons/elasto-online-store/26/00-ELASTOFONT-STORE-READY_user-circle-512.png'
				},
				{
					first: 'Maria',
					last: 'Amélia',
					email: 'maria.amelia@gmail.com',
					photo: 'https://cdn0.iconfinder.com/data/icons/elasto-online-store/26/00-ELASTOFONT-STORE-READY_user-circle-512.png'
				}
			]
		};

		// Update state
		reply.status === 'OK' ? this.setState({ users: reply.users }) : console.log('Server error');
	}
}

export default ManageUsers;
