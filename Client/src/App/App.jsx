import React from 'react';
import { Router, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute } from '../_components';
import { HomePage } from '../HomePage';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
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
                        <div class="row">
                            <div class="col-sm">
                                <Link to="/"><b>The Price Is Right</b></Link>
                            </div>
                            <div class="col-sm">
                                <Link to="/share">Share</Link>
                            </div>
                            <div class="col-sm">
                                <Link to="/add-new">Add new</Link>
                            </div>
                            <div class="col-sm">
                                <Link to="/supermarkets">Supermarkets</Link>
                            </div>
                            <div class="col-sm">
                                <Link to="/users">Users</Link>
                            </div>
                            <div class="col-sm">
                                {user && <p>Hi <Link to="/account">{user.firstName}</Link>! <Link to="/login">Logout</Link></p>}
                            </div>
                        </div>
                        <div class="row">
                            <div className="col-sm">
                                {alert.message &&
                                    <div className={`alert ${alert.type}`}>{alert.message}</div>
                                }
                                
                                    <div>
                                        <PrivateRoute exact path="/" component={HomePage} />
                                        <Route path="/login" component={LoginPage} />
                                        <Route path="/register" component={RegisterPage} />
                                        <Route path="/share" component={HomePage} />
                                        <Route path="/add-new" component={HomePage} />
                                        <Route path="/supermarkets" component={HomePage} />
                                        <Route path="/users" component={HomePage} />
                                        <Route path="/account" component={HomePage} />
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