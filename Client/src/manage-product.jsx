import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

class ManageProduct extends React.Component {
	render() {
		return (
			<Container>
				<Row>
					<Col lg="10">
						<p>
							{this.props.product.brand}
						</p>
						<p>{this.props.product.name}</p>
						<p>{this.props.product.ean}</p>
					</Col>
					<Col lg="2">
						<Image src={this.props.product.img} alt="product" rounded fluid />
					</Col>
					<ul>
						{this.props.product.supermarkets
							.sort((a, b) => (a.price > b.price ? 1 : -1))
							.map(supermarket => (
								<li>
									{supermarket.name}: {supermarket.price}€
							</li>
							))}
					</ul>
				</Row>
			</Container>
		);
	}
}

export default ManageProduct;
