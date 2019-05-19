import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import $ from 'jquery';

class Share extends React.Component {
	render() {
		return (
			<Container>
				<Row className="justify-content-md-center">
					<h1>Share a product's price</h1>
					{this.getSupermarketOptions()}
					<Form.Control type="number" placeholder="Enter EAN" id="ean" />
					<Form.Control type="number" placeholder="Enter price" id="price" />
					<Button variant="primary" type="submit" onClick={() => this.updatePrice()}>Update price</Button>
				</Row>
			</Container>
		);
	}

	getSupermarketOptions() {
		const select =
			<Form.Control as="select" id="supermarket">
				<option>Select a Supermarket</option>
				<option value="continente">Continente</option>
				<option value="pingo-doce">Pingo-Doce</option>
				<option value="intermarche">Intermarche</option>
				<option value="lidl">Lidl</option>
				<option value="jumbo">Jumbo</option>
			</Form.Control>;

		return select;
	}

	updatePrice() {
		const supermarket = $('#supermarket');
		const ean = $('#ean');
		const price = $('#price');

		if (supermarket.val() === '' || ean.val() === '' || price.val() === '') return;

		//console.log(supermarket.val());
		//console.log(ean.val());
		//console.log(price.val());

		// Send information to server and wait reply

		// Reply
		const reply = {
			status: 'OK',
			error: 'Supermarket not found' /*'EAN not found' 'Invalid price'*/
		};

		if (reply.status === 'OK') {
			this.props.snackbarMessage("The product price was updated.");
			ean.val("");
			price.val("");
		} else {
			this.props.snackbarMessage(reply.error);
			ean.val("");
			price.val("");
		}
	}
}

export default Share;
