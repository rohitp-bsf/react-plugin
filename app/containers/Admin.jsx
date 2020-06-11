import React, { Component } from 'react';
import PropTypes from 'prop-types';

import fetchWP from '../utils/fetchWP';

import Notice from '../components/notice';

export default class Admin extends Component {
  constructor(props) {
    super(props);

    // Set the default states
    this.state = {
      email: '',
      savedEmail: '',
      notice: false,
    };

    this.fetchWP = new fetchWP({
      restURL: this.props.wpObject.api_url,
      restNonce: this.props.wpObject.api_nonce,
    });

    this.getSetting();
  }

  getSetting = () => {
    this.fetchWP.get( 'admin' )
    .then(
      (json) => this.setState({
        email: json.value,
        savedEmail: json.value
      }),
      (err) => console.log( 'error', err )
    );
  };

  updateSetting = () => {
    this.fetchWP.post( 'admin', { email: this.state.email } )
    .then(
      (json) => this.processOkResponse(json, 'saved'),
      (err) => this.setState({
        notice: {
          type: 'error',
          message: err.message,
        }
      })
    );
  }

  deleteSetting = () => {
    this.fetchWP.delete( 'admin' )
    .then(
      (json) => this.processOkResponse(json, 'deleted'),
      (err) => console.log('error', err)
    );
  }

  processOkResponse = (json, action) => {
    if (json.success) {
      this.setState({
        email: json.value,
        savedEmail: json.value,
        notice: {
          type: 'success',
          message: `Setting ${action} successfully.`,
        }
      });
    } else {
      this.setState({
        notice: {
          type: 'error',
          message: `Setting was not ${action}.`,
        }
      });
    }
  }

  updateInput = (event) => {
    this.setState({
      email: event.target.value,
    });
  }

  handleSave = (event) => {
    event.preventDefault();
    if ( this.state.email === this.state.savedEmail ) {
      this.setState({
        notice: {
          type: 'warning',
          message: 'Setting unchanged.',
        }
      });
    } else {
      this.updateSetting();
    }
  }

  handleDelete = (event) => {
    event.preventDefault();
    this.deleteSetting();
  }

  clearNotice = () => {
    this.setState({
      notice: false,
    });
  }

  render() {
    let notice;
    
    if ( this.state.notice ) {
      notice = <Notice notice={this.state.notice} onDismissClick={this.clearNotice} />
    }

    return (
      <div className="wrap">
        {notice}
        <form>
          <h1> React Plugin Form Settings </h1>
          <br/>
          
          <label>
          Notification Email:
            <input
                style={ {
                  marginLeft: '5px'
                } }
              type="email"
              value={this.state.email}
              onChange={this.updateInput}
            />
          </label>

          <button
            id="save"
            style={ {
              marginLeft: '5px'
            } }
            className="button button-primary"
            onClick={this.handleSave}
          >Save</button>

          <button
            id="delete"
            style={ {
              marginLeft: '5px'
            } }
            className="button button-primary"
            onClick={this.handleDelete}
          >Delete</button>
        </form>
      </div>
    );
  }
}

Admin.propTypes = {
  wpObject: PropTypes.object
};