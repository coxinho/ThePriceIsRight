import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../_actions';


class Users extends React.Component {
    componentDidMount() {
        const { user } = this.props;

        // Se não houver um utilizador, enviá-lo para o login
        if(!user)
            history.push('/login');
        else // Caso contrário, obter todos os utilizadores registados
            this.props.dispatch(userActions.getAll());
    }

    handleDeleteUser(id) {
        return () => this.props.dispatch(userActions.delete(id)); // Apagar utilizador
    }

    render() {
        const { users } = this.props;
        return (
            <div className="container mt-4">
                <h2>All registered users:</h2>
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
        );
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

const connectedUsers = connect(mapStateToProps)(Users);
export { connectedUsers as Users };

