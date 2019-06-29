import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { config } from '../_config';
import { authHeader } from '../_helpers/auth-header';

class AddNewProduct extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            product: {
                brand: '',
                name: '',
                ean: '',
                continente: '',
                lidl: '',
                pingoDoce: '',
                dia: '',
                intermarche: '',
                jumbo: '',
            },
            submitted: false,
            creating: false,
            created: false,
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const { user } = this.props;
        if(!user)
            history.push('/login');
    }
    
    handleChange(e) {
        const { name, value } = e.target;
        let { product } = this.state;
        product[name] = value;
        this.setState({ product });
    }
    
    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });

        // Get search term
        let { product } = this.state;

		if (product.brand && product.name && product.ean && product.continente && product.dia && product.intermarche && product.pingoDoce && product.jumbo && product.lidl) {
            this.setState({ creating: true });

            // Pedir ao servidor para nos devolver toda a info acerca deste producto/ean
            const headers = {
                headers: {
                    ...authHeader(),
                    "Content-Type": "application/json",
                },
            };
            const url = `${config.baseURL}:${config.apiPort}/api/product/`;
            axios
            .post(url, JSON.stringify(product), headers)
            .then((response) => {
                console.log(response);
                this.setState({created: true, creating: false});
            })
            .catch((error) => {
                console.log(error);
                //this.props.snackbarMessage(error);
            });
		}
	}

    render() {
        const { submitted, creating, created } = this.state;
        const { product } = this.state;
        const { brand, name, ean, continente, dia, intermarche, pingoDoce, jumbo, lidl } = product;
        return (
            <div className="container mt-4">
                <h2>Add New Product</h2>
                {created && 
                <div className="alert alert-success" role="alert">
                    The product was successfuly created!
                </div>}
                <form name="form" onSubmit={this.handleSubmit} className={(submitted ? 'was-validated' : '')} noValidate>
                    <div className="form-row justify-content-between align-items-start">
                        <div className="col-6">
                            <div className={'form-group' + (submitted && !brand ? ' has-error' : '')}>
                                <label htmlFor="brand">Brand</label>
                                <input type="text" className="form-control" name="brand" value={brand} onChange={this.handleChange} required />
                                {submitted && !brand &&
                                    <div className="help-block">Brand is required</div>
                                }
                            </div>
                            <div className={'form-group' + (submitted && !name ? ' has-error' : '')}>
                                <label htmlFor="name">Name</label>
                                <input type="text" className="form-control" name="name" value={name} onChange={this.handleChange} required />
                                {submitted && !name &&
                                    <div className="help-block">Name is required</div>
                                }
                            </div>
                            <div className={'form-group' + (submitted && !ean ? ' has-error' : '')}>
                                <label htmlFor="ean">EAN</label>
                                <input type="text" className="form-control" name="ean" value={ean} onChange={this.handleChange} required />
                                {submitted && !ean &&
                                    <div className="help-block">EAN is required</div>
                                }
                            </div>
                            <div className="form-group">
                                <button className="btn btn-primary">Create new product</button>
                                {creating &&
                                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                                <Link to="/" className="btn btn-link">Go back</Link>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className={'form-group' + (submitted && !continente ? ' has-error' : '')}>
                                <label htmlFor="continente">Continente</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">€</span>
                                    </div>
                                    <input type="text" className="form-control" name="continente" value={continente} onChange={this.handleChange} required />
                                </div>
                                {submitted && !continente &&
                                    <div className="help-block">Continente is required</div>
                                }
                            </div>
                            <div className={'form-group' + (submitted && !dia ? ' has-error' : '')}>
                                <label htmlFor="dia">Dia</label>
                                
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">€</span>
                                    </div>
                                    <input type="text" className="form-control" name="dia" value={dia} onChange={this.handleChange} required />
                                </div>
                                {submitted && !dia &&
                                    <div className="help-block">Dia is required</div>
                                }
                            </div>
                            <div className={'form-group' + (submitted && !intermarche ? ' has-error' : '')}>
                                <label htmlFor="intermarche">Intermarche</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">€</span>
                                    </div>
                                    <input type="text" className="form-control" name="intermarche" value={intermarche} onChange={this.handleChange} required />
                                </div>
                                {submitted && !intermarche &&
                                    <div className="help-block">Intermarche is required</div>
                                }
                            </div>
                            <div className={'form-group' + (submitted && !pingoDoce ? ' has-error' : '')}>
                                <label htmlFor="pingoDoce">Pingo-Doce</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">€</span>
                                    </div>
                                    <input type="text" className="form-control" name="pingoDoce" value={pingoDoce} onChange={this.handleChange} required />
                                </div>
                                {submitted && !pingoDoce &&
                                    <div className="help-block">Pingo-Doce is required</div>
                                }
                            </div>
                            <div className={'form-group' + (submitted && !jumbo ? ' has-error' : '')}>
                                <label htmlFor="jumbo">Jumbo</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">€</span>
                                    </div>
                                    <input type="text" className="form-control" name="jumbo" value={jumbo} onChange={this.handleChange} required />
                                </div>
                                {submitted && !jumbo &&
                                    <div className="help-block">Jumbo is required</div>
                                }
                            </div>
                            <div className={'form-group' + (submitted && !lidl ? ' has-error' : '')}>
                                <label htmlFor="lidl">Lidl</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">€</span>
                                    </div>
                                    <input type="text" className="form-control" name="lidl" value={lidl} onChange={this.handleChange} required />
                                </div>
                                {submitted && !lidl &&
                                    <div className="help-block">Lidl is required</div>
                                }
                            </div>
                        </div>
                    </div>
                </form>
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

const connectedAddNewProduct = connect(mapStateToProps)(AddNewProduct);
export { connectedAddNewProduct as AddNewProduct };