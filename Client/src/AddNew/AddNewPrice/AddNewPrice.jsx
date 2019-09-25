import React from 'react';
import { connect } from 'react-redux';
import { priceActions } from '../../_actions';
import { SupermarketSelect } from '../SupermarketSelect';
import { SupermarketLocationSelect } from '../SupermarketLocationSelect';
import { ProductSelect } from '../ProductSelect';

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
        
        this.handleSupermarketSelect = this.handleSupermarketSelect.bind(this);
        this.handleSupermarketLocationSelect = this.handleSupermarketLocationSelect.bind(this);
        this.handleProductSelect = this.handleProductSelect.bind(this);
        this.handlePrice = this.handlePrice.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSupermarketSelect(selectedSupermarketId) {
        this.setState({
            selectedSupermarketId: selectedSupermarketId
        });
    }

    handleSupermarketLocationSelect(selectedLocationId) {
        this.setState({
            selectedLocationId: selectedLocationId
        });
    }

    handleProductSelect(selectedEan) {
        this.setState({
            selectedEan: selectedEan
        });
    }

    handlePrice(e) {
        const price = e.target.value;
        if(price == '') return;
        this.setState({
            price: price
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { dispatch, user } = this.props;
        const { selectedSupermarketId, selectedLocationId, selectedEan, price } = this.state;
        if(selectedSupermarketId == '' || selectedLocationId == '' || selectedEan == '' || price == '') return;
        const newPrice = {
            idUser: user.id,
            idSupermarket: selectedSupermarketId,
            idLocation: selectedLocationId,
            ean: selectedEan,
            price: price
        };
        dispatch(priceActions.create(newPrice)); // Call the redux and server API
    }

    render() {
        const { submitted, selectedSupermarketId } = this.state;
        return (
            <form name="price-form" onSubmit={this.handleSubmit} className={(submitted ? 'was-validated' : '')} noValidate>
                <div className="justify-content-between align-items-start">

                    <h5>Add New Price</h5>
                    <SupermarketSelect onSelect={ this.handleSupermarketSelect } />
                    {selectedSupermarketId && 
                        <SupermarketLocationSelect selectedSupermarketId={selectedSupermarketId} onSelect={ this.handleSupermarketLocationSelect } />
                    }
                    <ProductSelect onSelect={ this.handleProductSelect } />
                    <div className="form-group">
                        <div className="input-group mt-5">
                            <div className="input-group-prepend">
                                <span className="input-group-text">€</span>
                            </div>
                            <input type="text" className="form-control" name="price" onChange={this.handlePrice} required />
                        </div>
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

