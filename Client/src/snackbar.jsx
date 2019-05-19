import React from 'react';
import './snackbar.css';

class Snackbar extends React.Component {
	render() {
		const cls = (this.props.message === '' ? '' : 'show');
		return <p className={`snackbar ${cls}`}>{this.props.message}</p>;
	}
}

export default Snackbar;
