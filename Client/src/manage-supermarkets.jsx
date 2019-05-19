import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import $ from 'jquery';

class ManageSupermarkets extends React.Component {
	constructor() {
		super();
		const supermarkets = this.getSupermarkets();
		this.state = {
			supermarkets: supermarkets
		};
	}

	render() {
		return (
			<Container>
				<h1>Manage Supermarkets</h1>
				{this.state.supermarkets.map((item, i) => {
					const supermarket =
						<Row>
							<Col lg="10">{item.name}</Col>
							<Col lg="2"><Button onClick={() => this.deleteSupermarket(item)}>Delete</Button></Col>
						</Row>
					return supermarket;
				})}
				<Row>
					<Col lg="8">
						<Form.Control type="text" placeholder="New supermarket" id="new-supermarket" />
					</Col>
					<Col lg="4">
						<Button variant="primary" type="submit" onClick={() => this.add()}>Add</Button>
					</Col>
				</Row>
			</Container>
		);
	}

	deleteSupermarket(supermarket) {
		// Vai pedir ao servidor para eliminar este supermercado

		// Se o servidor responder que removeu o supermercado da base de dados, removemos aqui também
		const supermarkets = this.state.supermarkets.filter((element) => element.id !== supermarket.id);
		this.setState({ supermarkets: supermarkets });
		this.props.snackbarMessage(`${supermarket.name} was deleted successfully!`);
	}

	getSupermarkets() {
		// Vai ao servidor buscar supermercados
		const supermarkets = [
			{ name: 'Continente', id: 1 },
			{ name: 'Pingo-Doce', id: 2 },
			{ name: 'Intermarche', id: 3 },
			{ name: 'Lidl', id: 4 },
			{ name: 'Jumbo', id: 5 },
			{ name: 'Dia', id: 6 }
		];

		return supermarkets;
	}

	add() {
		const newSupermarket = $('#new-supermarket').val();

		// Enviar newSupermarket para o servidor

		const reply = {
			status: 'OK',
			id: 10
		};
		// Se o servidor responder com 'OK', adicionar este newSupermarket à nossos dados
		if (reply.status === 'OK') {
			let supermarkets = this.state.supermarkets.slice();
			supermarkets.push({
				name: newSupermarket,
				id: reply.id
			});
			this.setState({ supermarkets: supermarkets });
			//console.log(supermarkets);
			this.props.snackbarMessage(`The new ${newSupermarket} supermarket was added successfully!`);
		}
	}
}

export default ManageSupermarkets;
