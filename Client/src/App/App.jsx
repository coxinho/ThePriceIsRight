import React from 'react';
import { Router, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute } from '../_components';
import { HomePage } from '../HomePage';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
import { ProductUpdate } from '../ProductUpdate';
import { AddNewProduct } from '../AddNewProduct';
import { Users } from '../Users';
import { Account } from '../Account';
import { Snackbar } from '../Snackbar';

class App extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            time: null
        };

        const { dispatch } = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }

    render() {
        const { alert, user, snackbarMessage } = this.props;
        return (
            <div className="jumbotron">
                <Router history={history}>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm">
                                <Link to="/"><b>The Price Is Right</b></Link>
                            </div>
                            {user && <div className="col-sm text-center"><Link to="/add-new">Add new</Link></div>}
                            {user && user.admin && <div className="col-sm text-center"><Link to="/users">Users</Link></div>}
                            {/*user && <div class="col-sm"><p>Hi <Link to="/account">{user.firstName}</Link>! <Link to="/login">Logout</Link></p></div>*/}
                            {user ?
                                (<div className="col-sm text-right"><p>Hi <Link to="/account">{user.firstName}</Link>! <Link to="/login">Logout</Link></p></div>)
                                :
                                (<div className="col-sm text-right"><Link to="/login">Login</Link></div>)
                            }
                        </div>
                        <div className="row">
                            <div className="col-sm">
                                {alert.message &&
                                    <div className={`alert ${alert.type}`}>{alert.message}</div>
                                }
                                
                                    <div>
                                        <Route exact path="/" component={HomePage} />
                                        <Route path="/login" component={LoginPage} />
                                        <Route path="/register" component={RegisterPage} />
                                        <PrivateRoute path="/product-update" component={ProductUpdate} />
                                        <PrivateRoute path="/add-new" component={AddNewProduct} />
                                        <PrivateRoute path="/users" component={Users} />
                                        <PrivateRoute path="/account" component={Account} />
                                    </div>
                            </div>
                        </div>
                    </div>
                </Router>
                {/*<Snackbar message={snackbarMessage} />*/}
            </div>
        );
    }

    snackbarMessage(msg) {
        this.setState({ snackbarMessage: msg });
		clearTimeout(this.state.time);
		this.setState({
			time: setTimeout(() => {
				this.setState({ snackbarMessage: '' });
			}, 4000)
		});
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