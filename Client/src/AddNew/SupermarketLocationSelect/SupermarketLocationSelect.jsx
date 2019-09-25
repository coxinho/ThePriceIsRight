import React from 'react';
import { connect } from 'react-redux';
import { supermarketLocationActions } from '../../_actions';

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
        $('select.selectpicker').selectpicker(); // Call this on the action callback
        $('.bootstrap-select input').keyup( (e) => {
            // Obter o termo que o utilizador introduziu
            const term = e.target.value;

            if(term == '') return;
            
            // Pedir ao servidor para nos enviar todas as localizações que começam ou contêm o termo
            const { dispatch, selectedSupermarketId } = this.props;
            dispatch(supermarketLocationActions.search(selectedSupermarketId, term)); // Call the redux and server API
        });
    }

    componentDidUpdate() {
        $('select.selectpicker').selectpicker('refresh');
    }
     
    handleChange(e) {
        const locationId = e.target.value;
        if(locationId == '') return;
        this.props.onSelect(locationId);
    }

    render() {
        const {supermarketLocations} = this.props;
        let searchResults = null;
        if(supermarketLocations != null)
            searchResults = supermarketLocations.searchResults;
        return (
            <div>
                 <div className="form-group">
                    <label>Location *</label>
                    <select id="location-picker" style={{height: 200}} className="selectpicker form-control" title="Choose a location" data-live-search="true" data-size="8" onChange={this.handleChange}>
                        {searchResults && searchResults.map((result, index) => 
                                <option value={result.id} data-content={`${result.location}`} key={result.id}>{result.location}</option>
                        )}
                    </select>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { authentication, supermarketLocations } = state;
    const { user } = authentication;
    return {
        user,
        supermarketLocations,
    };
}

const connectedSupermarketLocationSelect = connect(mapStateToProps)(SupermarketLocationSelect);
export { connectedSupermarketLocationSelect as SupermarketLocationSelect };

