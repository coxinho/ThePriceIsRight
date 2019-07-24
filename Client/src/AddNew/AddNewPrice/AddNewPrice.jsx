import React from 'react';
import { connect } from 'react-redux';

class AddNewPrice extends React.Component {
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
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault(); // Prevent form submission to the server, because we want to call the API endpoint
        this.setState({ submitted: true }); // Validate form
        const { ean, price } = this.state;
        if (!ean || price) return; // If the fields are empty, return (form will be validated)
        const product = {
            ean: ean,
            price: price,
        };
        const { dispatch } = this.props;
        dispatch(productActions.create(product)); // Call the redux and server API
    }

    render() {
        const { ean, submitted } = this.state;
        return (
            <form name="price-form" onSubmit={this.handleSubmit} className={(submitted ? 'was-validated' : '')} noValidate>
                <div className="justify-content-between align-items-start">

                    <h5>Add New Price</h5>
                    
                    <div className="form-group">
                        <label htmlFor="ean">EAN * <span className="badge badge-secondary" data-toggle="tooltip" data-placement="top" title="The European Article Numbers uniquely identifies a product, packaging and it's manufacturer.">?</span></label>
                        <input type="text" pattern="[0-9]{13}" className={'form-control'} name="ean" value={ean} onChange={this.handleChange} required />
                        {submitted &&
                            <div className="invalid-feedback">EAN needs to be 13 numbers.</div>
                        }
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">€</span>
                        </div>
                        <input type="text" className="form-control" name="pingoDoce" required />
                    </div>
                    
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

const connectedAddNewPrice = connect(mapStateToProps)(AddNewPrice);
export { connectedAddNewPrice as AddNewPrice };

