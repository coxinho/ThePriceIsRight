import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { config } from '../_config';
import { authHeader } from '../_helpers/auth-header';

class Account extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                firstName: '',
                lastName: '',
                username: '',
            },
            submitted: false,
            updating: false,
            updated: false,
            error: false,
            errorMessage: '',
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        // Assim que o componente se monta, validar utilizador
        const { user } = this.props;
        if(!user) // Se não existir um utilizador
            history.push('/login'); // Enviá-lo para o login
        else
            this.setState({ user }); // Caso contrário, registar este utilizador no estado do componente
    }
    
    // Gravar propriedades do utilizador no estado do componente
    handleChange(event) {
        const { name, value } = event.target;
        const { user } = this.state;
        user[name] = value;
        this.setState({ user });
    }
    
    handleSubmit(e) {
        e.preventDefault(); // Impedir que o formulário seja submetido para o servidor, já que queremos fazer uma chamada à sua API

        this.setState({ submitted: true });
        
        let { user } = this.state;
        // Validar password, firstname, lastname e username
        const password = document.getElementById("password").value;
        if(password)
            user["password"] = password;

		if (user.firstName && user.lastName && user.username) {
            this.setState({ updating: true });

            // Pedir ao servidor actualizar este utilizador
            const headers = {
                headers: {
                    ...authHeader(),
                    "Content-Type": "application/json",
                },
            };
            const url = `${config.baseURL}:${config.apiPort}/users/${user.id}`;
            axios
            .put(url, JSON.stringify(user), headers)
            .then(() => {
                this.setState({error: false, updated: true, updating: false});
            })
            .catch((error) => {
                this.setState({error: true, errorMessage: error.response.data.message});
            });
		}
	}

    render() {
        const { submitted, updating, updated, user, error, errorMessage } = this.state;
        const { firstName, lastName, username } = user;
        return (
            <div className="container mt-4">
                <h2>Edit your account</h2>

                {error && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
                {updated && 
                <div className="alert alert-success" role="alert">
                    Your account was successfuly updated!
                </div>}
                
                <form name="form" onSubmit={this.handleSubmit} className={(submitted ? 'was-validated' : '')} noValidate>
                    <div className={'form-group' + (submitted && !firstName ? ' has-error' : '')}>
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" className="form-control" name="firstName" value={firstName} onChange={this.handleChange} />
                        {submitted && !firstName &&
                            <div className="help-block">First Name is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !lastName ? ' has-error' : '')}>
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" className="form-control" name="lastName" value={lastName} onChange={this.handleChange} />
                        {submitted && !lastName &&
                            <div className="help-block">Last Name is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="username" value={username} onChange={this.handleChange} required />
                        {submitted && !username &&
                            <div className="help-block">Username is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" id="password" />
                        {submitted && !password &&
                            <div className="help-block">Password is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Update Account</button>
                        {updating && 
                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                        <Link to="/" className="btn btn-link">Go back</Link>
                    </div>
                </form>
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

const connectedAccount = connect(mapStateToProps)(Account);
export { connectedAccount as Account };

