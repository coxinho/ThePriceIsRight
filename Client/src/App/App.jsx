import React from 'react';
import { connect } from 'react-redux';
import { Link, Route, Router } from 'react-router-dom';
import { Account } from '../Account';
import { AddNew } from '../AddNew';
import { EditSupermarketBrands } from '../EditSupermarketBrands';
import { HomePage } from '../HomePage';
import { LoginPage } from '../LoginPage';
import { ProductUpdate } from '../ProductUpdate';
import { RegisterPage } from '../RegisterPage';
import { Users } from '../Users';
import { alertActions } from '../_actions';
import { PrivateRoute } from '../_components';
import { history } from '../_helpers';


class App extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            time: null
        };

        // Limpar alertas quando se muda de localização
        const { dispatch } = this.props;
        history.listen((location, action) => {
            dispatch(alertActions.clear());
        });
    }

    render() {
        const { alert, user } = this.props;
        return (
            <div className="jumbotron">
                <Router history={history}>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm">
                                <Link to="/"><b>The Price Is Right</b></Link>
                            </div>
                            {user && user.admin && <div className="col-sm text-center"><Link to="/add-new">Add new</Link></div>}
                            {user && user.admin && <div className="col-sem text-center"><Link to="/edit-supermarkets">Edit Supermarkets</Link></div>}
                            {user && user.admin && <div className="col-sm text-center"><Link to="/users">Users</Link></div>}
                            {user ?
                                (<div className="col-sm text-right"><p>Hi <Link to="/account">{user.firstName}</Link>! <Link to="/login">Logout</Link></p></div>)
                                :
                                (<div className="col-sm text-right"><Link to="/login">Login</Link></div>)
                            }
                        </div>
                        <div className="row">
                            <div className="col-sm">
                                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div> }
                                
                                <div>
                                    <Route exact path="/" component={HomePage} />
                                    <Route path="/login" component={LoginPage} />
                                    <Route path="/register" component={RegisterPage} />
                                    <PrivateRoute path="/product-update" component={ProductUpdate} />
                                    <PrivateRoute path="/add-new" component={AddNew} />
                                    <PrivateRoute path="/edit-supermarkets" component={EditSupermarketBrands} />
                                    <PrivateRoute path="/users" component={Users} />
                                    <PrivateRoute path="/account" component={Account} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Router>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { alert, authentication } = state;
    const { user } = authentication;
    return {
        alert,
        user
    };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App };

