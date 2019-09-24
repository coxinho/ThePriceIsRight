import React from 'react';
import { connect } from 'react-redux';
import { SupermarketSelect } from '../SupermarketSelect';
import { SupermarketLocationSelect } from '../SupermarketLocationSelect';

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
    }
    
    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    render() {
        const { ean, submitted } = this.state;
        return (
            <form name="price-form" onSubmit={this.handleSubmit} className={(submitted ? 'was-validated' : '')} noValidate>
                <div className="justify-content-between align-items-start">

                    <h5>Add New Price</h5>
                    <SupermarketSelect onSelect={ this.handleSelect } />
                    <SupermarketLocationSelect />
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
                        <button className="btn btn-primary">Create new price</button>
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

