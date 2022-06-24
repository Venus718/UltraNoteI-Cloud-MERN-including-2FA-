/**
 *
 * App
 *
 */

import React, { Component } from 'react';
import { io } from 'socket.io-client';
import cookie from 'js-cookie';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import Routes from 'containers/__Routes';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectApp from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import SocketContext from '../../context';

import GlobalStyle from '../../global-styles';
import theme from '../../material-theme'
import { autoLogin } from '../../store/auth/auth.actions';


let socketConnection = null;
const token = localStorage.getItem('token');
const auth = cookie.get('Auth');
if (token && auth) {
  const socketConnectionOptions = {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${window.localStorage.token}` || '',
        },
      },
    },
    path:"/api/socket"
  };
  socketConnection = io('https://cloud.ultranote.org', socketConnectionOptions);
}

/* eslint-disable react/prefer-stateless-function */
export class App extends Component {

  constructor(props) {
    super(props);
    this.state = { socket: socketConnection };
    console.log('ok');
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      const {autoLogin} = this.props;
      autoLogin({token, user});
    }
  }

  t(msg, values) {
    return this.props.intl.formatMessage(msg, values);
  }
  render() {
    return (
    <SocketContext.Provider value={{ socket: this.state.socket, setSocket: connection => {
            if (connection) this.setState({ socket: connection });
          } }}>
        <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyle />
        <Helmet
          titleTemplate={`%s - ${this.props.intl.formatMessage({
            ...messages.appTitle,
          })}`}
          defaultTitle={this.props.intl.formatMessage({ ...messages.appTitle })}
        />
        <Routes />
        <ToastContainer position="top-right" />
      </MuiThemeProvider>
       </SocketContext.Provider>
      )
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
});

const mapDispatchToProps = (dispatch) => ({
  autoLogin: (payload) => dispatch(autoLogin(payload)),
  dispatch: () => dispatch()
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'app', reducer });
const withSaga = injectSaga({ key: 'app', saga });

export default compose(
  withRouter,
  withReducer,
  withSaga,
  withConnect,
)(injectIntl(App));
