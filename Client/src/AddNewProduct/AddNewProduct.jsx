import axios from 'axios';
import bsCustomFileInput from 'bs-custom-file-input';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { config } from '../_config';
import { authHeader } from '../_helpers/auth-header';

class AddNewProduct extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            product: {
                ean: '',
                brand: '',
                name: '',
                photo: {
                    name: '',
                    type: '',
                    size: '',
                    base64: '',
                },
            },
            submitted: false,
            creating: false,
            created: false,
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePhoto = this.handlePhoto.bind(this);
    }

    componentDidMount() {
        // Assim que o componente monta, validar o utilizador
        const { user } = this.props;
        if(!user) // Se não houver um utilizador logado
            history.push('/login'); // Redirecioná-lo para o login
        bsCustomFileInput.init();
        $('[data-toggle="tooltip"]').tooltip();
    }
    
    // Gravar propriedades do producto no estado do componente
    handleChange(e) {
        const { name, value } = e.target;
        let { product } = this.state;
        product[name] = value;
        this.setState({ product, created: false });
    }

    handlePhoto(e) {
        let { product } = this.state;
        const file = e.target.files[0]; // Get the file
        let reader = new FileReader(); // Make new FileReader
        reader.readAsDataURL(file); // Convert the file to base64 text
        reader.onload = () => { // on reader load
            const photo = { // Make a fileInfo Object
                name: file.name,
                type: file.type,
                size: Math.round(file.size / 1000) + ' kB',
                base64: reader.result,
            };
            product['photo'] = photo; // Set product's photo
            this.setState({ product, created: false }); // Save it to the state
        }
    }
    
    handleSubmit(e) {
        e.preventDefault(); // Prevent form submission to the server, because we want to call the API endpoint

        this.setState({ submitted: true });

        // Validate product
        const { product } = this.state;
		if (product.ean && product.brand && product.name && product.photo) {
            this.setState({ creating: true });

            // Post new product data to API endpoint
            const headers = {
                headers: {
                    ...authHeader(),
                    "Content-Type": "application/json",
                },
            };
            const url = `${config.baseURL}:${config.apiPort}/api/product/`;
            console.log(product);
            axios
            .post(url, JSON.stringify(product), headers)
            .then(() => {
                this.setState({error: false, created: true, creating: false});
            })
            .catch((error) => {
                this.setState({error: true, errorMessage: error.response.data.message});
            });
		}
    }

    render() {
        const { submitted, creating, created, product, error, errorMessage } = this.state;
        const { ean, brand, name, photo } = product;
        const continente = false; const lidl = false; const pingoDoce = false; const intermarche = false; const jumbo = false; const dia = false;
        return (
            <div className="container mt-4">
                <h2>Add New Product</h2>

                {error && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
                {created && 
                <div className="alert alert-success" role="alert">
                    The product was successfuly created!
                </div>}

                <form name="form" onSubmit={this.handleSubmit} className={(submitted ? 'was-validated' : '')} noValidate>
                    <div className="form-row justify-content-between align-items-start">
                        <div className="col-6">
                            <div className="form-group">
                                <label htmlFor="ean">EAN * <span className="badge badge-secondary" data-toggle="tooltip" data-placement="top" title="The European Article Numbers uniquely identifies a product, packaging and it's manufacturer.">?</span></label>
                                <input type="text" pattern="[0-9]{13}" className={'form-control'} name="ean" value={ean} onChange={this.handleChange} required />
                                {submitted &&
                                    <div className="invalid-feedback">EAN needs to be 13 numbers.</div>
                                }
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="brand">Brand *</label>
                                <input type="text" className="form-control" name="brand" value={brand} onChange={this.handleChange} required />
                                {submitted && !brand &&
                                    <div className="invalid-feedback">Brand is required</div>
                                }
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="name">Name *</label>
                                <input type="text" className="form-control" name="name" value={name} onChange={this.handleChange} required />
                                {submitted && !name &&
                                    <div className="invalid-feedback">Name is required</div>
                                }
                            </div>
                            <label>Photo</label>
                            <div className={'form-group custom-file'}>
                                <label>Photo</label>
                                <input type="file" className="custom-file-input" id="customFile" name="photo" onChange={this.handlePhoto} />
                                <label className="custom-file-label" htmlFor="customFile">Choose photo</label>
                            </div>
                                
                            <div style={{height: 200, width: 200, marginBottom: 20}}>
                                {photo.base64 && <img src={photo.base64} alt="Product photo preview" height="200px" />}
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

