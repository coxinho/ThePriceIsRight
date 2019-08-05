import React from 'react';
import { connect } from 'react-redux';
import { supermarketBrandActions } from '../../_actions';

class UpdateSupermarketBrand extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '',
            name: '',
            logo: '',
            submitted: false,
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleLogo = this.handleLogo.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        const { id, name, logo } = this.props;
        this.setState({ id: id, name: name, logo: logo });
    }
    
    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleLogo(e) {
        const file = e.target.files[0]; // Get the file
        let reader = new FileReader(); // Make new FileReader
        reader.readAsDataURL(file); // Convert the file to base64 text
        reader.onload = () => { // on reader load
            const logo = reader.result; // Set the logo
            this.setState({ logo: logo }); // Save it to the state
        }
    }
    
    handleUpdate(e) {
        e.preventDefault();
        this.setState({ submitted: true }); // Validate form
        const { dispatch } = this.props;
        const { id, name, logo } = this.state; // Extract object from state
		if (!id || !name || !logo) return; // If the fields are empty, return (form will be validated)
        const supermarketBrand = {
            id: id,
            name: name,
            logo: logo,
        };
        dispatch(supermarketBrandActions.update(supermarketBrand));
    }

    handleDelete(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        const { id } = this.state; // Extract object from state
		if (!id) return; // If the fields are empty, return (form will be validated)
        dispatch(supermarketBrandActions._delete(id));
    }

    render() {
        const { name, logo, submitted } = this.state;
        return (
            <div className="col">
                <form name="form" className={(submitted ? 'was-validated' : '')} noValidate>
                    
                    <div className="row align-items-start">
                        <div className="col">
                            <div className={'form-group'}>
                                <label htmlFor="name">Name *</label>
                                <input type="text" className="form-control" name="name" value={name} onChange={this.handleChange} required />
                                {submitted && !name &&
                                    <div className="invalid-feedback">Name is required</div>
                                }
                            </div>
                        </div>
                        
                        <div className="col">
                            <label>Logo *</label>
                            <span style={{display: 'inline-block', verticalAlign: 'top', marginLeft: 20, height: 20, width: 20}}>{logo && <img src={logo} alt="Supermarket logo preview" width="20px" />}</span>
                            <div className={'form-group custom-file'}>
                                <input type="file" className="custom-file-input" id="customFile" name="logo" onChange={this.handleLogo} />
                                <label className="custom-file-label" htmlFor="customFile">Choose a 20x20 pixel logo</label>
                                {submitted && !logo &&
                                    <div className="invalid-feedback">Logo is required</div>
                                }
                            </div>
                        </div>

                        <div className="col align-self-end">
                            <div className="form-group">
                                <div className="btn-group d-flex" role="group" aria-label="Update or delete supermarket brand">
                                    <button className="btn btn-primary" onClick={this.handleUpdate}>Update brand</button>
                                    <button className="btn btn-danger" onClick={this.handleDelete}>Delete</button>
                                </div>
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
        user
    };
}

const connectedUpdateSupermarketBrand = connect(mapStateToProps)(UpdateSupermarketBrand);
export { connectedUpdateSupermarketBrand as UpdateSupermarketBrand };

