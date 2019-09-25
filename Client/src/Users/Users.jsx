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
        const { users, user } = this.props;
        return (
            <div className="container mt-4">
                <h2>All registered users:</h2>
                {users.loading && <em>Loading users...</em>}
                {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                {users.items &&
                    <div>
                        {users.items.map((u, index) =>
                            <p key={u.id}>
                                {u.firstName + ' ' + u.lastName}
                                {
                                    u.deleting ? <em> - Deleting...</em>
                                    : u.deleteError ? <span className="text-danger"> - ERROR: {u.deleteError}</span>
                                    : user.id == u.id ? <span>&nbsp;</span>
                                    : <span> - <button className="btn btn-primary btn-sm" onClick={this.handleDeleteUser(u.id)}>Delete</button></span>
                                }
                            </p>
                        )}
                    </div>
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

