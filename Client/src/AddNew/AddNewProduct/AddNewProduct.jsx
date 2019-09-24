import React from 'react';
import { connect } from 'react-redux';
import { productActions } from '../../_actions';

class AddNewProduct extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ean: '',
            brand: '',
            name: '',
            photo: '',
            submitted: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handlePhoto = this.handlePhoto.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handlePhoto(e) {
        const file = e.target.files[0]; // Get the file
        let reader = new FileReader(); // Make new FileReader
        reader.readAsDataURL(file); // Convert the file to base64 text
        reader.onload = () => { // on reader load
            this.setState({ photo: reader.result }); // Save it to the state
        }
    }
    
    handleSubmit(e) {
        e.preventDefault(); // Prevent form submission to the server, because we want to call the API endpoint
        this.setState({ submitted: true }); // Validate form
        const { ean, brand, name, photo } = this.state;
        if (!ean || !brand || !name || !photo) return; // If the fields are empty, return (form will be validated)
        const product = {
            ean: ean,
            brand: brand,
            name: name,
            photo: photo,
        };
        const { dispatch } = this.props;
        dispatch(productActions.create(product)); // Call the redux and server API
    }

    render() {
        const { ean, brand, name, photo, submitted } = this.state;
        return (
            <form name="supermarket-form" onSubmit={this.handleSubmit} className={(submitted ? 'was-validated' : '')} noValidate>
                <div className="justify-content-between align-items-start">

                    <h5>Add New Product</h5>
                    
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
                    <label>Photo *</label>
                    <div className={'form-group custom-file'}>
                        <label>Photo</label>
                        <input type="file" className="custom-file-input" id="customFile" name="photo" onChange={this.handlePhoto} required />
                        <label className="custom-file-label" htmlFor="customFile">Choose photo</label>
                        {submitted && !photo &&
                            <div className="invalid-feedback">Photo is required</div>
                        }
                    </div>
                        
                    {photo &&
                        <div style={{height: 200, width: 200, marginBottom: 20}}>
                            <img src={photo} alt="Product photo preview" height="200px" />
                        </div>
                    }
                    
                    <div className="form-group">
                        <button className="btn btn-primary">Create new product</button>
                    </div>
                </div>
            </form>
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

