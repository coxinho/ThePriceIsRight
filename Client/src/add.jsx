import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import $ from 'jquery';
import config from './config.js';

const axios = require('axios');

class Add extends React.Component {
	render() {
		return (
			<Container>
				<Row className="justify-content-md-center">
					<h1>Add new product</h1>
					<Col lg="4">
						<Form.Control type="text" placeholder="EAN" id="ean" />
					</Col>
					<Col lg="4">
						<Form.Control type="text" placeholder="Brand" id="brand" />
					</Col>
					<Col lg="4">
						<Form.Control type="text" placeholder="Product" id="product" />
					</Col>
				</Row>
				<Row>
					<Form.Control type="text" placeholder="Continente" id="continente" />
					<Form.Control type="text" placeholder="Lidl" id="lidl" />
					<Form.Control type="text" placeholder="Pingo-Doce" id="pingodoce" />
					<Form.Control type="text" placeholder="Intermarche" id="intermarche" />
					<Form.Control type="text" placeholder="Jumbo" id="jumbo" />
					<Form.Control type="text" placeholder="Dia" id="dia" />
                </Row>
				<Row>
					<Col lg="12">
                    <Button variant="primary" type="submit" onClick={() => this.add()}>Add new product</Button>
                    </Col>
                </Row>
			</Container>
		);
	}

	add() {
		// Get search term
		const ean = $('#ean').val();
		const brand = $('#brand').val();
		const product = $('#product').val();
		const continente = $('#continente').val();
		const lidl = $('#lidl').val();
		const pingodoce = $('#pingodoce').val();
		const intermarche = $('#intermarche').val();
		const jumbo = $('#jumbo').val();
        const dia = $('#dia').val();
        
        // Validations
		if (ean === '') {
            this.props.snackbarMessage('EAN cannot be empty.');
            return;
		}
		if (brand === '') {
			this.props.snackbarMessage('rand cannot be empty.');
			return;
		}
		if (product === '') {
			this.props.snackbarMessage('Product cannot be empty.');
			return;
		}
		if (continente === '') {
			this.props.snackbarMessage('Continente cannot be empty.');
			return;
		}
		if (lidl === '') {
			this.props.snackbarMessage('Lidl cannot be empty.');
			return;
		}
		if (pingodoce === '') {
			this.props.snackbarMessage('Pingo-Doce cannot be empty.');
			return;
		}
		if (intermarche === '') {
			this.props.snackbarMessage('Intermarche cannot be empty.');
			return;
		}
		if (jumbo === '') {
			this.props.snackbarMessage('Jumbo cannot be empty.');
			return;
		}
		if (dia === '') {
			this.props.snackbarMessage('Dia cannot be empty.');
			return;
        }
        
        const body = {
            ean: ean,
            brand: brand,
            product: product,
            continente: continente,
            lidl: lidl,
            pingodoce: pingodoce,
            intermarche: intermarche,
            jumbo: jumbo,
            dia: dia,
        };
		// Pedir ao servidor para nos devolver toda a info acerca deste producto/ean
		//const url = `${config.baseURL}:${config.apiPort}/api/product?search=${term}`;
		const url = `http://localhost:5000/api/product`;
		axios.post(url, body) 
		.then(function (response) {
            console.log(response);
            // Redirect to just inserted product
			this.props.history.push(`/api/product/${response.data.id}`);
            // Snackbar message
            this.props.snackbarMessage("Product successfuly added!");
		})
		.catch((error) => {
			console.log(error);
			this.props.snackbarMessage(error);
		});
	}
}

export default Add;
