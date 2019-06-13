import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../_actions';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searching: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(userActions.getAll());
    }

    handleDeleteUser(id) {
        return (e) => this.props.dispatch(userActions.delete(id));
    }

    render() {
        const { users } = this.props;
        const { searching } = this.state;
        return (
            <div class="container">
                <form name="form" onSubmit={this.handleSubmit}>
                    <div class="form-row justify-content-between align-items-end">
                        <div class="col-9">
                            <input type="text" class="form-control" id="searchterm" placeholder="Search..." />
                        </div>
                        <div class="col-3">
                            <button type="submit" class="btn btn-primary btn-block">Search</button>
                        </div>
                    </div>
                </form>
                {searching &&
                    <div class="row justify-content-center">
                        <h1>Searching...</h1>
                    </div>
                }
                


                <div className="col-md-6 col-md-offset-3">
                    <h3>All registered users:</h3>
                    {users.loading && <em>Loading users...</em>}
                    {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                    {users.items &&
                        <ul>
                            {users.items.map((user, index) =>
                                <li key={user.id}>
                                    {user.firstName + ' ' + user.lastName}
                                    {
                                        user.deleting ? <em> - Deleting...</em>
                                        : user.deleteError ? <span className="text-danger"> - ERROR: {user.deleteError}</span>
                                        : <span> - <a onClick={this.handleDeleteUser(user.id)}>Delete</a></span>
                                    }
                                </li>
                            )}
                        </ul>
                    }
                </div>
            </div>
        );
    }

	handleSubmit(e) {
        e.preventDefault();

        this.setState({ searching: true });

		// Get search term
		/*const term = $('#search').val();
		if (term === '') {
			this.props.snackbarMessage('Empty query!');
			return;
		}
		// Pedir ao servidor para nos devolver toda a info acerca deste producto/ean
		//const url = `${config.baseURL}:${config.apiPort}/api/product?search=${term}`;
		const url = `http://localhost:5000/api/product?search=${term}`;
		axios.get(url) 
		.then(function (response) {
			console.log(response);
			//this.setState({results: response});
		})
		.catch((error) => {
			console.log(error);
			//this.props.snackbarMessage(error);
		});*/
	}
}

function mapStateToProps(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return {
        user,
        users
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };