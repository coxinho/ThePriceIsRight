import React from 'react';
import { connect } from 'react-redux';
import { supermarketLocationActions } from '../../_actions';
import { SupermarketSelect } from './SupermarketSelect';

class AddNewSupermarketLocation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            supermarketBrand: {
                id: '',
                name: '',
                logo: '',
            },
            location: '',
            latitude: '',
            longitude: '',
            submitted: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSelect(selectedSupermarket) {
        this.setState({ supermarketBrand: selectedSupermarket });
    }
    
    handleSubmit(e) {
        e.preventDefault(); // Prevent form submission to the server, because we want to call the API endpoint
        this.setState({ submitted: true }); // Validate form
        const { supermarketBrand, location, latitude, longitude } = this.state;
        const { id, name, logo } = supermarketBrand;
        if (!id || !name || !logo || !location || !latitude || !longitude) return; // If the fields are empty, return (form will be validated)
        const supermarketLocation = {
            idSupermarketBrand: id,
            location,
            latitude,
            longitude,
        };
        const { dispatch } = this.props;
        dispatch(supermarketLocationActions.create(supermarketLocation)); // Call the redux and server API
    }

    render() {
        const { location, latitude, longitude, submitted } = this.state;
        return (
            <form name="supermarket-form" onSubmit={this.handleSubmit} className={(submitted ? 'was-validated' : '')} noValidate>
                <h5>Add New Location</h5>
                <SupermarketSelect onSelect={ this.handleSelect } />
                <div className={'form-group'}>
                    <label htmlFor="location">Location *</label>
                    <input type="text" className="form-control" name="location" value={location} onChange={this.handleChange} required />
                    {submitted && !location &&
                        <div className="invalid-feedback">Location is required</div>
                    }
                </div>
                <div className={'form-group'}>
                    <label htmlFor="latitude">Latitude * <a href="https://www.gps-coordinates.net/" target="_blank" className="badge badge-secondary">Get GPS Coordinates</a></label>
                    <input type="text" className="form-control" name="latitude" value={latitude} onChange={this.handleChange} required />
                    {submitted && !latitude &&
                        <div className="invalid-feedback">Latitude is required</div>
                    }
                </div>
                <div className={'form-group'}>
                    <label htmlFor="longitude">Longitude * <a href="https://www.gps-coordinates.net/" target="_blank" className="badge badge-secondary">Get GPS Coordinates</a></label>
                    <input type="text" className="form-control" name="longitude" value={longitude} onChange={this.handleChange} required />
                    {submitted && !longitude &&
                        <div className="invalid-feedback">Longitude is required</div>
                    }
                </div>

                <div className="form-group">
                    <button className="btn btn-primary">Add new supermarket</button>
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

const connectedAddNewSupermarketLocation = connect(mapStateToProps)(AddNewSupermarketLocation);
export { connectedAddNewSupermarketLocation as AddNewSupermarketLocation };

