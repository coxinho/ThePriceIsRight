import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import { config } from '../_config';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searching: false,
            searchTerm: '',
            searchSuccess: false,
            searchResults: [],
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const { value } = event.target;
        this.setState({ searchTerm: value });
    }
    
    handleSubmit(e) {
        e.preventDefault();

        // Get search term
        const { searchTerm } = this.state;
		if (searchTerm === '') {
			//this.props.snackbarMessage('Empty query!');
			return;
		}

        this.setState({ searching: true });

		// Pedir ao servidor para nos devolver toda a info acerca deste producto/ean
		const url = `${config.baseURL}:${config.apiPort}/api/product?search=${searchTerm}`;
		axios.get(url) 
		.then((response) => {
            const { data } = response;
            this.setState({searchResults: data, searchSuccess:true, searching: false});
            console.log(data);
		})
		.catch((error) => {
			console.log(error);
			//this.props.snackbarMessage(error);
		});
	}

    render() {
        const { user } = this.props;
        const { searching } = this.state;
        const { searchSuccess, searchResults } = this.state;
        return (
            <div className="container mt-4">
                <h2>Search for products</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className="form-row justify-content-between align-items-end">
                        <div className="col-9">
                            <input type="text" className="form-control" id="searchterm" placeholder="Search..." onChange={this.handleChange} />
                        </div>
                        <div className="col-3">
                            <button type="submit" className="btn btn-primary btn-block">Search</button>
                        </div>
                    </div>
                </form>
                
                <div className="row py-4">
                    {searching &&
                        <div className="row justify-content-center">
                            <h1>Searching...</h1>
                        </div>
                    }
                    {searchSuccess &&
                        searchResults.map((product, index) =>
                            <div className="col-3" key={index}>
                                <div className="card mb-4" style={{width: 200 + 'px'}}>
                                    {/*<img src="#" class="card-img-top" alt="Image alt text" />*/}
                                    <div className="card-body">
                                        <h5 className="card-title">{product.brand}</h5>
                                        <p className="card-text">{product.name}</p>
                                        <p className="card-text">{product.ean}</p>
                                        <ul>
                                            <li>Continente: {product.continente}€</li>
                                            <li>Dia: {product.dia}€</li>
                                            <li>Intermarche: {product.intermarche}€</li>
                                            <li>Pingo-Doce: {product.pingoDoce}€</li>
                                            <li>Jumbo: {product.jumbo}€</li>
                                            <li>Lidl: {product.lidl}€</li>
                                        </ul>
                                        {user && <Link to={{
                                            pathname: '/product-update',
                                            state: {
                                                product: product
                                            }
                                        }}  className="btn btn-primary">Update product</Link>}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { authentication } = state;
    const { user } = authentication;
    return {
        user,
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };