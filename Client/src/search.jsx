import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import $ from 'jquery';

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			reply: null,
			results: []
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
							</Col>
							<Col lg="2">
								<Image src={item.img} alt="product" rounded fluid />
							</Col>
							<ul>
								{item.supermarkets
									.sort((a, b) => (a.price > b.price ? 1 : -1))
									.map(supermarket => (
										<li>
											{supermarket.name}: {supermarket.price}€
										</li>
									))}
							</ul>
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
		var reply = {
			status: 'OK',
			results: [
				{
					brand: 'Nestle',
					name: 'Leite Magro',
					ean: '123-456-789',
					img: 'https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/201604/06/05220912300223____5__600x600.jpg',
					supermarkets: [
						{ name: 'PingoDoce', price: 3 },
						{ name: 'Continente', price: 3.2 },
						{ name: 'Lidl', price: 2.9 },
						{ name: 'Intermarche', price: 2.5 }
					]
				},
				{
					brand: 'Nestle',
					name: 'Leite Meio Gordo',
					ean: '123-456-789',
					img: 'https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/201604/06/05220912300223____5__600x600.jpg',
					supermarkets: [
						{ name: 'PingoDoce', price: 3 },
						{ name: 'Continente', price: 3.2 },
						{ name: 'Lidl', price: 2.9 },
						{ name: 'Intermarche', price: 2.5 }
					]
				},
				{
					brand: 'Nestle',
					name: 'Leite Gordo',
					ean: '123-456-789',
					img: 'https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/201604/06/05220912300223____5__600x600.jpg',
					supermarkets: [
						{ name: 'PingoDoce', price: 3 },
						{ name: 'Continente', price: 3.2 },
						{ name: 'Lidl', price: 2.9 },
						{ name: 'Intermarche', price: 2.5 }
					]
				},
				{
					brand: 'Nestle',
					name: 'KitKat',
					ean: '123-456-789',
					img: 'https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/201604/06/05220912300223____5__600x600.jpg',
					supermarkets: [
						{ name: 'PingoDoce', price: 3 },
						{ name: 'Continente', price: 3.2 },
						{ name: 'Lidl', price: 2.9 },
						{ name: 'Intermarche', price: 2.5 }
					]
				},
				{
					brand: 'Nestle',
					name: 'Chocapic',
					ean: '123-456-789',
					img: 'https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/201604/06/05220912300223____5__600x600.jpg',
					supermarkets: [
						{ name: 'PingoDoce', price: 3 },
						{ name: 'Continente', price: 3.2 },
						{ name: 'Lidl', price: 2.9 },
						{ name: 'Intermarche', price: 2.5 }
					]
				}
			]
		};

		if (reply.status === 'OK') {
			this.setState({ results: reply.results });
		} else {
			this.props.snackbarMessage('No search results!');
			//console.log('No search results!');
		}
	}

	manageProduct(product) {
		this.props.setProduct(product);
		this.props.history.push('/product');
	}
}

export default Search;
