import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import $ from 'jquery';
import config from './config.js';

const axios = require('axios');

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			results: [],
		};
	}

	render() {
		return (
			<Container>
				<Row className="justify-content-md-center">
					<h1>Search Products</h1>
					<Col lg="10">
						<Form.Control type="text" placeholder="Search for EAN, brand or product" id="search" />
					</Col>
					<Col lg="2">
						<Button variant="primary" type="submit" onClick={() => this.search()}>
							Search
						</Button>
					</Col>
				</Row>
				{this.state.results.map((item, i) => {
					return (
						<Row>
							<Col lg="10">
								<p>
									{item.brand}
									{this.props.userType === 'admin' && <button onClick={() => this.manageProduct(item)}>Manage Product</button>}
								</p>
								<p>{item.name}</p>
								<p>{item.ean}</p>
								<ul>
									<li>Continente: {item.Continente}€</li>
									<li>Lidl: {item.Lidl}€</li>
									<li>Pingo-Doce: {item.pingoDoce}€</li>
									<li>Intermarche: {item.Intermarche}€</li>
									<li>Jumbo: {item.Jumbo}€</li>
									<li>Dia: {item.Dia}€</li>
								</ul>
							</Col>
						</Row>
					);
				})}
			</Container>
		);
	}

	search() {
		// Get search term
		const term = $('#search').val();
		if (term === '') {
			this.props.snackbarMessage('Empty query!');
			return;
		}
		// Pedir ao servidor para nos devolver toda a info acerca deste producto/ean
		//const url = `${config.baseURL}:${config.apiPort}/api/product?search=${term}`;
		const url = `http://localhost:5000/api/product?search=${term}`;
		axios.get(url) 
		.then(function (response) {
			console.log(response);
			//this.setState({results: response});
		})
		.catch((error) => {
			console.log(error);
			//this.props.snackbarMessage(error);
		});
	}

	manageProduct(product) {
		this.props.setProduct(product);
		this.props.history.push('/product');
	}
}

export default Search;
