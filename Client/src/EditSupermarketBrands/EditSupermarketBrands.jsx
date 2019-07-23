import React from 'react';
import { connect } from 'react-redux';
import { supermarketBrandActions } from '../_actions';
import { AddSupermarketBrand } from './AddSupermarketBrand';
import { UpdateSupermarketBrand } from './UpdateSupermarketBrand';

class EditSupermarketBrands extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            supermarketBrands: {
                searchResults: [],
            },
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    componentDidMount() {
        const { dispatch, user, supermarketBrands } = this.props;
        const { searchResults } = supermarketBrands;
        if(!user)
            history.push('/login');

        if(searchResults) {
            this.setState({
                supermarketBrands: {
                    searchResults: searchResults
                }
            });
        } else {
            dispatch(supermarketBrandActions.getAll());
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.supermarketBrands !== this.props.supermarketBrands)
            this.setState({ supermarketBrands: this.props.supermarketBrands });
    }

    render() {
        const { supermarketBrands } = this.state;
        const { searchResults } = supermarketBrands;
        return (
            <div className="container mt-4">
                <h2>Edit Supermarket Brands</h2>

                <div className="row">
                    <div className="col">
                        <AddSupermarketBrand />
                    </div>
                </div>

                <h5>Update current brands</h5>
                {supermarketBrands && searchResults !== undefined &&
                    searchResults.map((supermarketBrand) => 
                        <div className="row" key={supermarketBrand.id}>
                            <UpdateSupermarketBrand id={supermarketBrand.id} name={supermarketBrand.name} logo={supermarketBrand.logo} />
                        </div>
                    )
                }
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

const connectedEditSupermarketBrands = connect(mapStateToProps)(EditSupermarketBrands);
export { connectedEditSupermarketBrands as EditSupermarketBrands };


