import React from 'react';

class Snackbar extends React.Component {
	render() {
        const { message } = this.props;
        return (
            <div class="container position-fixed fixed-bottom">
                <div class="row">
                    {message &&
                        <div>{message}</div>
                    }
                </div>
            </div>
        );
    }
}
