import React from 'react';
import { connect } from 'react-redux';
import { productActions } from '../../_actions';

class ProductSelect extends React.Component {
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
            
            // Pedir ao servidor para nos enviar todos os produtos contêm o termo
            const { dispatch } = this.props;
            dispatch(productActions.search(term)); // Call the redux and server API
        });
    }

    componentDidUpdate() {
        $('select.selectpicker').selectpicker('refresh');
    }
     
    handleChange(e) {
        const ean = e.target.value;
        if(ean == '') return;
        this.props.onSelect(ean);
    }

    render() {
        const {products} = this.props;
        let searchResults = null;
        if(products != null)
            searchResults = products.searchResults;
        return (
            <div>
                 <div className="form-group">
                    <label>Product *</label>
                    <select style={{height: 200}} className="selectpicker form-control" title="Choose a product" data-live-search="true" data-size="8" onChange={this.handleChange}>
                        {searchResults && searchResults.map((result, index) => 
                                <option value={result.ean} data-content={`<img src='${result.photo}' width='40' style='float:left; padding-right:10px' /> ${result.brand}, ${result.name}<br /><span style='font-size:12px; color:#ccc'>${result.ean}</span>`} key={result.ean}>{result.ean}</option>
                        )}
                    </select>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { authentication, products } = state;
    const { user } = authentication;
    return {
        user,
        products,
    };
}

const connectedProductSelect = connect(mapStateToProps)(ProductSelect);
export { connectedProductSelect as ProductSelect };

