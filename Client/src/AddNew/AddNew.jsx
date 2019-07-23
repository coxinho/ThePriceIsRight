import React from 'react';
import { connect } from 'react-redux';
import { AddNewPrice } from './AddNewPrice';
import { AddNewProduct } from './AddNewProduct';
import { AddNewSupermarketLocation } from './AddNewSupermarketLocation';

class AddNew extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        const { user } = this.props;
        if(!user) // Se não houver um utilizador logado
            history.push('/login'); // Redirecioná-lo para o login
        //bsCustomFileInput.init();
        //$('[data-toggle="tooltip"]').tooltip();
    }

    render() {
        return (
            <div className="container mt-4">
                <div className="row">
                    <div className="col-4"><AddNewSupermarketLocation /></div>
                    <div className="col-4"><AddNewProduct /></div>
                    <div className="col-4"><AddNewPrice /></div>
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

const connectedAddNew = connect(mapStateToProps)(AddNew);
export { connectedAddNew as AddNew };

