import React from 'react';
import { connect } from 'react-redux';
import { supermarketBrandActions } from '../../../_actions';

class SupermarketSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const { dispatch, user, supermarketBrands } = this.props;
        if(!user) history.push('/login'); // If the user isn't logged in, redirect

        const { searchResults } = supermarketBrands;
        if (!searchResults)
            dispatch(supermarketBrandActions.getAll());
        else
            this.setState({
                supermarketBrands: {
                    searchResults: searchResults,
                },
            });
    }

    componentDidUpdate(prevProps) {
        if(prevProps.supermarketBrands !== this.props.supermarketBrands)
            this.setState({ supermarketBrands: this.props.supermarketBrands });
        $('select.selectpicker').selectpicker(); // Call this on the action callback
    }

    handleChange(e) {
        const selectedSupermarketId = e.target.value;
        const { supermarketBrands } = this.state;
        const { searchResults } = supermarketBrands;
        const selectedSupermarket = searchResults.find(el => el.id === selectedSupermarketId);
        this.props.onSelect(selectedSupermarket);
    }

    render() {
        const { supermarketBrands } = this.props;
        const { searchResults } = supermarketBrands;
        return (
            <div>
                 <div className="form-group">
                    <label>Supermarket *</label>
                    {searchResults &&
                        <select style={{height: 200}} className="selectpicker form-control" title="Choose a supermarket" data-live-search="true" data-size="8" onChange={this.handleChange}>
                            {searchResults.map((supermarket, index) => 
                                <option value={supermarket.id} data-content={`<img src='${supermarket.logo}' /> ${supermarket.name}`} key={supermarket.id}>{supermarket.name}</option>
                            )}
                        </select>
                    }
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { authentication, supermarketBrands } = state;
    const { user } = authentication;
    return {
        user,
        supermarketBrands,
    };
}

const connectedSupermarketSelect = connect(mapStateToProps)(SupermarketSelect);
export { connectedSupermarketSelect as SupermarketSelect };

