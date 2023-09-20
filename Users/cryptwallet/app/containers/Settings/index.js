/**
 *
 * Settings
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import _ from 'lodash';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField'

import makeSelectSettings from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

import Form from '../../components/uiStyle/Form';

import Image from '../../components/uiStyle/Images';

import AuthLock from '../../images/auth-lock-icon.png';

import './style.scss';
import { toast } from 'react-toastify';
import { selectUser, auth2FAActivity } from '../../store/auth/auth.selectors';
import { enableTwoAuthStart, changeCurrencyStart, auth2FATMP, auth2FAConfirm } from '../../store/auth/auth.actions';
import Redirect from 'react-router-dom/es/Redirect';
import {getWalletStart} from '../../store/wallet/wallet.actions';

const styles = theme => ({
  colorBar: {},
  colorChecked: {},
  iOSSwitchBase: {
    '&$iOSChecked': {
      color: theme.palette.common.white,
      '& + $iOSBar': {
        backgroundColor: '#6258FB',
      },
    },
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.sharp,
    }),
  },
  iOSChecked: {
    transform: 'translateX(48px)',
    '& + $iOSBar': {
      opacity: 1,
    },
  },
  iOSBar: {
    borderRadius: 100,
    width: 94,
    height: 44,
    marginTop: -22,
    marginLeft: -30,
    border: 'none',
    backgroundColor: '#A4A4A4',
    opacity: 1,
    transition: theme.transitions.create(['background-color']),
  },
  iOSIcon: {
    width: 40,
    height: 40,
  },
  iOSIconChecked: {
    boxShadow: theme.shadows[1],
  },
});

/* eslint-disable react/prefer-stateless-function */
export class Settings extends React.Component {

  constructor(props){
    super(props);

    const {connectedUser} = this.props;

    this.state = {
      code: '',
      checked: connectedUser.two_fact_auth,
      otpchecked: connectedUser.otp_auth,
      language: 'english',
      currency: connectedUser.currency,
      auth2FA: null
    };
  }

  static getDerivedStateFromProps(props, state) {
    if(!_.isEqual(props.auth2FATMPValue, state.auth2FA)){
      return{
          auth2FA: props.auth2FATMPValue == '' ? null : props.auth2FATMPValue,
      };
    }
    if(props.connectedUser.two_fact_auth != state.checked){
      return {
        checked: props.connectedUser.two_fact_auth
      }
    }
    
    return null; // No change to state
  }

  handleChange = event => {
    this.setState({ otpchecked: event.target.checked });
  };

  authSubmitHandler = e => {
    e.preventDefault();
    

    const {changeTwoAuthStatus, connectedUser} = this.props;
    const payload = {
      isActive: this.state.otpchecked,
      _id: connectedUser.id == undefined ? connectedUser._id : connectedUser.id
    };
    changeTwoAuthStatus(payload);
  };

  TwoFAHandler = e => {
    this.setState({code: ''}) 
    if(!this.state.checked){
      this.setState({checked: true})
      this.props.auth2FATMP({
        state: true,
        _id: this.props.connectedUser.id == undefined ? this.props.connectedUser._id : this.props.connectedUser.id
      })
    }
    else {
      this.setState({checked: false})
      this.props.auth2FATMP({
        state: false,
        _id: this.props.connectedUser.id == undefined ? this.props.connectedUser._id : this.props.connectedUser.id
      })
    }   
    e.preventDefault();
  };

  ChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onChangeCode = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  onCodeSave = e => {
    e.preventDefault();
    this.props.auth2FAConfirm({
      token: this.state.code,
      _id: this.props.connectedUser.id == undefined ? this.props.connectedUser._id : this.props.connectedUser.id
    })
  }
  onCodeCancel = e => {
    e.preventDefault()
    this.props.auth2FATMP({
      state: false,
      _id: this.props.connectedUser.id == undefined ? this.props.connectedUser._id : this.props.connectedUser.id
    })
  }

  preferenceSubmitHandler = e => {
    e.preventDefault();

    const {changeCurrency, connectedUser, getWallets} = this.props;
    const payload = {
      id: connectedUser.id,
      language: this.state.language,
      currency: this.state.currency,
    };

    changeCurrency(payload);
    getWallets(connectedUser.id);
  };

  render() {
    const { classes } = this.props;
    const { language, currency } = this.state;

    if (!this.props.connectedUser) {
      return <Redirect to='/login' />;
    };
    
    return (
      <Grid className="settingsArea">
        <Grid className="container">
          <Grid className="settingsBody">
            <Typography component="h4" className="section-title">
              Mail Authentication Settings
            </Typography>
            <Grid className="setAuthentication">
              <Image src={AuthLock} />
              <Form onSubmit={this.authSubmitHandler}>
                <Grid container>
                  <Grid item xs={12} md={6}>
                    <Typography className="subTitle">
                      OTP Setting
                    </Typography>
                    <Typography component="p">
                      Enable your OTP one time password.
                      You will receive codes to your email address.
                    </Typography>
                    <Button type="submit" className="formSubmitBtn" disabled={this.props.connectedUser.otp_auth === this.state.otpchecked}>
                      Set up
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography className="subTitle">Security</Typography>
                    <Typography component="p">
                      Please make sure to enable OTP
                      at login for a better account security.
                    </Typography>
                    <Grid className="swtichCheck">
                      <FormControlLabel
                        control={
                          <Switch
                            classes={{
                              switchBase: classes.iOSSwitchBase,
                              bar: classes.iOSBar,
                              icon: classes.iOSIcon,
                              iconChecked: classes.iOSIconChecked,
                              checked: classes.iOSChecked,
                            }}
                            disableRipple
                            checked={this.state.otpchecked}
                            onChange={this.handleChange}
                            value="checked"
                          />
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            </Grid>
          </Grid>
          {
            this.state.auth2FA == null  ? (
              <Grid className="settingsBody mt8">
                <Typography component="h4" className="section-title">
                  2FA Authentication Settings
                </Typography>
                <Grid className="setAuthentication">
                  <Form onSubmit={this.TwoFAHandler}>
                    <Grid container>
                      <Grid item xs={12} md={12}>
                        <Typography className="subTitle">
                          Authenticator app
                        </Typography>
                        <Typography component="p">
                          Use the Authenticator app to get verification codes,
                          You can use Google Authenticator or any similar apps.
                        </Typography>
                        <Button type="submit" className="formSubmitBtn">
                          {!this.state.checked ? 'Enable' : 'Disable'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Form>
                </Grid>
              </Grid>
            ) : (
              <Grid className="settingsBody mt8">
                <Typography component="h4" className="section-title">
                  2FA Authentication Settings
                </Typography>
                <Grid className="setAuthentication">
                  <Form onSubmit={this.TwoFAHandler}>
                    <Grid container>
                      <Grid item xs={12} md={12}>
                        <Grid container>
                          <Grid item xs={6} md={3}>
                            <img src={this.state.auth2FA.qrCode} />
                          </Grid>
                          <Grid item xs={6} md={9}>
                            <TextField id="code" label="CODE" variant="outlined" name='code' value={this.state.code} onChange={this.onChangeCode} margin="normal" fullWidth />
                            <Grid container>
                              <Grid item xs={6} md={6}>
                                <Button variant="contained" color="primary" onClick={this.onCodeSave}>
                                  Confirm
                                </Button>
                              </Grid>
                              <Grid item xs={6} md={6}>
                                <Button variant="outlined" color="default" onClick={this.onCodeCancel}>
                                  Cancel
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Form>
                </Grid>
              </Grid>
            )
          }
          <Grid className="settingsBody mt8">
            <Typography component="h4" className="section-title">
              Preference Settings
            </Typography>
            <Grid className="preferenceSettings">
              <Form onSubmit={this.preferenceSubmitHandler}>
                <Grid container spacing={16}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth className="selectInputField">
                      <InputLabel shrink htmlFor="language">
                        Language
                      </InputLabel>
                      <Select
                        className="inputSelectStyle"
                        value={language}
                        onChange={this.ChangeHandler}
                        input={<Input name="language" id="language" />}
                        displayEmpty
                        name="language"
                      >
                        <MenuItem value="english">English</MenuItem>
                        <MenuItem value="portuguese">Portuguese</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth className="selectInputField">
                      <InputLabel shrink htmlFor="language">
                        Currency
                      </InputLabel>
                      <Select
                        className="inputSelectStyle"
                        value={currency}
                        onChange={this.ChangeHandler}
                        input={<Input name="currency" id="currency" />}
                        displayEmpty
                        name="currency"
                      >
                        <MenuItem value="usd">USD</MenuItem>
                        <MenuItem value="btc">BTC</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button className="formSubmitBtn" type="submit">
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

Settings.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  settings: makeSelectSettings(),
  connectedUser: selectUser(state),
  auth2FATMPValue: auth2FAActivity(state)
});

const mapDispatchToProps = (dispatch) => ({
  changeTwoAuthStatus: (payload) => dispatch(enableTwoAuthStart(payload)),
  changeCurrency: (payload) => dispatch(changeCurrencyStart(payload)),
  getWallets: (payload) => dispatch(getWalletStart(payload)),
  auth2FATMP: (payload) => dispatch(auth2FATMP(payload)),
  auth2FAConfirm: (payload) => dispatch(auth2FAConfirm(payload))
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'settings', reducer });
const withSaga = injectSaga({ key: 'settings', saga });



export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(styles)(Settings));
