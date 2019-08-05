import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { config } from '../_config';
import { authHeader } from '../_helpers/auth-header';

class ProductUpdate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            submitted: false,
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePhoto = this.handlePhoto.bind(this);
    }

    componentDidMount () {
        // Assim que o componente for montado, colocar o producto que vem do estado nas propriedades
        const { product } = this.props.location.state;
        this.setState({ product });
    }
    
    // Esta função guarda as propriedades do producto que forem alteradas, no estado do componente
    handleChange(e) {
        const { name, value } = e.target;
        let { product } = this.state;
        product[name] = value;
        this.setState({ product });
    }

    handlePhoto(e) {
        const file = e.target.files[0]; // Get the file
        let reader = new FileReader(); // Make new FileReader
        reader.readAsDataURL(file); // Convert the file to base64 text
        reader.onload = () => { // on reader load
            let { product } = this.state;
            product['photo'] = reader.result; // Set the photo
            this.setState({ product }); // Save it to the state
        }
    }
    
    handleSubmit(e) {
        e.preventDefault(); // Impedir que o formulário se submeta para o servidor, já que queremos fazer uma chamada à sua API

        this.setState({ submitted: true });

        // Validar producto
        const { product } = this.state;
        console.log(product);
        if (!product.ean || !product.brand || !product.name || !product.photo) return;

        // Pedir ao servidor para actualizar o producto com este id na base de dados
        const headers = {
            headers: {
                ...authHeader(),
                "Content-Type": "application/json",
            },
        };
        const url = `${config.baseURL}:${config.apiPort}/api/product/${product.ean}`;
        axios
        .put(url, JSON.stringify(product), headers)
        .then((response) => {
            this.setState({updated: true, updating: false});
        })
        .catch((error) => {
            console.log(error);
        });
	}

    render() {
        const { submitted, updating, updated } = this.state;
        const { product } = this.props.location.state;
        const { ean, brand, name, photo } = product;
        return (
            <div className="container mt-4">
                <h2>Update product</h2>

                {updated && 
                <div className="alert alert-success" role="alert">
                    The product was successfuly updated!
                </div>}

                <form name="form" onSubmit={this.handleSubmit} className={(submitted ? 'was-validated' : '')} noValidate>
                    <div className="form-row justify-content-between align-items-start">
                        <div className="col">
                            <div className={'form-group' + (submitted && !ean ? ' has-error' : '')}>
                                <label htmlFor="ean">{`EAN: ${ean}`}</label>
                            </div>

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

                            <label>Photo *</label>
                            <div className={'form-group custom-file'}>
                                <input type="file" className="custom-file-input" id="customFile" name="photo" onChange={this.handlePhoto} />
                                <label className="custom-file-label" htmlFor="customFile">Choose a 200x200 pixel photo</label>
                                {submitted && !photo &&
                                    <div className="invalid-feedback">Photo is required</div>
                                }
                            </div>
                            <div style={{height: 200, width: 200, marginBottom: 20, marginTop: 20}}>
                                {photo && <img src={photo} alt="Product photo preview" height="200px" />}
                            </div>

                            <div className="form-group">
                                <button className="btn btn-primary">Update</button>
                                {updating &&
                                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                                <Link to="/" className="btn btn-link">Go back</Link>
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

const connectedProductUpdate = connect(mapStateToProps)(ProductUpdate);
export { connectedProductUpdate as ProductUpdate };

