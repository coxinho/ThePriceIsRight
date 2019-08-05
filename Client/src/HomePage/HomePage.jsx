import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { config } from '../_config';
import { authHeader } from '../_helpers/auth-header';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searching: false,
            searchTerm: '',
            searchSuccess: false,
            searchResults: [],
            deleting: false,
            deleted: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }

    handleChange(event) {
        const { value } = event.target;
        this.setState({ searchTerm: value });
    }
    
    handleSubmit(e) {
        e.preventDefault(); // Impedir que o formulário seja submetido para o servidor

        // Validar termo de pesquisa
        const { searchTerm } = this.state;
		if (searchTerm === '')
			return;

        this.setState({ searching: true });

		// Pedir ao servidor para nos devolver toda a info acerca deste producto
		const url = `${config.baseURL}:${config.apiPort}/api/product?search=${searchTerm}`;
		axios.get(url) 
		.then((response) => {
            const { data } = response;
            this.setState({searchResults: data, searchSuccess: true, searching: false});
		})
		.catch((error) => {
			console.log(error); // Se houve erro, ver o erro na consola
		});
    }
    
    deleteProduct(id, index) {
        this.setState({ deleting: true });

        // Pedir ao servidor para nos devolver toda a info acerca deste producto/ean
        const headers = {
            headers: {
                ...authHeader(),
                "Content-Type": "application/json",
            },
        };
		const url = `${config.baseURL}:${config.apiPort}/api/product/${id}`;
		axios.delete(url, headers) 
		.then(() => {
            const { searchResults } = this.state;
            searchResults.splice(index, 1);
            this.setState({
                deleting: false,
                deleted: true,
            });
		})
		.catch((error) => {
			console.log(error); // Se houve erro, ver o erro na consola
		});
    }

    render() {
        const { user } = this.props;
        const { searching, searchSuccess, searchResults, deleting, deleted } = this.state;
        return (
            <div className="container mt-4">
                <h2>Search for products</h2>

                {deleting && <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />}
                {deleted && 
                <div className="alert alert-success" role="alert">
                    The product was successfuly deleted!
                </div>}

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
                                <div className="card-deck">
                                    <div className="card mb-4" style={{width: 200 + 'px'}}>
                                        <div className="card-body">
                                            <p className="card-text">{product.ean}</p>
                                            <p className="card-title">{product.brand}</p>
                                            <p className="card-text">{product.name}</p>
                                            <img width="100%" style={{marginBottom:20}} src={product.photo} />
                                            <div className="container">
                                                <div className="row justify-content-between">
                                                    <div className="col-6">
                                                        {user && <Link to={{
                                                            pathname: '/product-update',
                                                            state: {
                                                                product: product
                                                            }
                                                        }}  className="btn btn-primary">Update</Link>}
                                                    </div>
                                                    <div className="col-6">
                                                        {user && user.admin && <button className="btn btn-primary" onClick={() => this.deleteProduct(product.id, index)}>Delete</button>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="row">
                    <div className="col-12">
                        <p>Engenharia Informática, Tecnologias da Internet 2, 2018/2019, Cristina Coxinho, nº8811</p>
                        <p>Servidor: .Net Core Web API, JWT, MongoDB</p>
                        <p>Cliente: React, Redux, Bootstrap, Axios</p>
                        <p>Administrador: cristinacoxinho / 123456. Utilizador: luisacoxinho / 123456</p>
                    </div>
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


