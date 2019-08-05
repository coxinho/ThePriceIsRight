import React from 'react';
import { connect } from 'react-redux';
import { supermarketBrandActions } from '../../_actions';

class AddSupermarketBrand extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            supermarket: {
                name: '',
                logo: '',
            },
            submitted: false,
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleLogo = this.handleLogo.bind(this);
    }

    componentDidMount() {
       // When the component mounts, validate the user
        const { user } = this.props;
        if(!user) // If user isn't logged in
            history.push('/login'); // Redirect to login page
    }
    
    // Gravar propriedades do producto no estado do componente
    handleChange(e) {
        const { name, value } = e.target;
        let { supermarket } = this.state;
        supermarket[name] = value;
        this.setState({ supermarket, created: false });
    }

    handleLogo(e) {
        let { supermarket } = this.state;
        const file = e.target.files[0]; // Get the file
        let reader = new FileReader(); // Make new FileReader
        reader.readAsDataURL(file); // Convert the file to base64 text
        reader.onload = () => { // on reader load
            supermarket['logo'] = reader.result; // Set the logo
            this.setState({ supermarket, created: false }); // Save it to the state
        }
    }
    
    handleSubmit(e) {
        e.preventDefault(); // Prevent form submission to the server, because we want to call the API endpoint
        this.setState({ submitted: true }); // Validate form
        const { dispatch } = this.props;
        const { supermarket } = this.state; // Extract object from state
		if (!supermarket.name || !supermarket.logo) return; // If the fields are empty, return (form will be validated)
        dispatch(supermarketBrandActions.create(supermarket)); // Call the redux and server API
    }

    render() {
        const { supermarket, submitted } = this.state;
        const { name, logo } = supermarket;
        return (
            <form name="form" onSubmit={this.handleSubmit} className={(submitted ? 'was-validated' : '')} noValidate>
                <h5>Add New Brand</h5>

                <div className="row align-items-start">
                    <div className="col">
                        <div className={'form-group'}>
                            <label htmlFor="name">Name *</label>
                            <input type="text" className="form-control" name="name" value={name} onChange={this.handleChange} required />
                            {submitted && !name &&
                                <div className="invalid-feedback">Name is required</div>
                            }
                        </div>
                    </div>
                    
                    <div className="col">
                        <label>Logo *</label>
                        <span style={{display: 'inline-block', verticalAlign: 'top', marginLeft: 20, height: 20, width: 20}}>{logo && <img src={logo} alt="Supermarket logo preview" width="20px" />}</span>
                        <div className={'form-group custom-file'}>
                            <input type="file" className="custom-file-input" id="customFile" name="logo" onChange={this.handleLogo} required />
                            <label className="custom-file-label" htmlFor="customFile">Choose a 20x20 pixel logo</label>
                            {submitted && !logo &&
                                <div className="invalid-feedback">Logo is required</div>
                            }
                        </div>
                    </div>

                    <div className="col align-self-end">
                        <div className="form-group">
                            <button className="btn btn-primary btn-block">Add new brand</button>
                        </div>
                    </div>
                </div>
            </form>
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

const connectedAddSupermarketBrand = connect(mapStateToProps)(AddSupermarketBrand);
export { connectedAddSupermarketBrand as AddSupermarketBrand };

