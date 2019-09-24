import React from 'react';
import { connect } from 'react-redux';
import { supermarketBrandActions } from '../../_actions';

class SupermarketLocationSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const { user } = this.props;
        if(!user) history.push('/login'); // If the user isn't logged in, redirect
        const select = $('select.selectpicker').selectpicker(); // Call this on the action callback
        $('.bootstrap-select input').change( function () {
            console.log('Alguem escreveu!');
        });
        $('#location-picker').on('show.bs.dropdown', function () {
            console.log('Alguem escreveu v2!');
        })
        $('.bs-searchbox input').change(function () {
            console.log('Alguem escreveu v3!');
        })
        $('select.selectpicker').change(function () {
            console.log('Alguem escreveu v4!');
        });

        select.on('shown.bs.select', function (e) {
            console.log('shown');
        });

        select.on('changed.bs.select', function (e) {
            console.log('changed');
        });

    }

    handleChange(e) {
        console.log('handleChange()');
    }

    render() {
        const searchResults = [];
        return (
            <div>
                 <div className="form-group">
                    <label>Location *</label>
                    {searchResults &&
                        <select id="location-picker" style={{height: 200}} className="selectpicker form-control" title="Choose a location" data-live-search="true" data-size="8" onChange={this.handleChange}>
                            {searchResults.map((location, index) => 
                                <option value={location.id} data-content={`${location.name}`} key={location.id}>{location.name}</option>
                            )}
                        </select>
                    }
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

const connectedSupermarketLocationSelect = connect(mapStateToProps)(SupermarketLocationSelect);
export { connectedSupermarketLocationSelect as SupermarketLocationSelect };

