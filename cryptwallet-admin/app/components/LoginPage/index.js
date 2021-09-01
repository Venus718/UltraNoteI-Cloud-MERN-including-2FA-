import React, { Component, Fragment } from 'react';
import { injectIntl } from 'react-intl';
import { Link, withRouter, Redirect } from 'react-router-dom';
import Joi from 'joi-browser';

import {
  Grid,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from '@material-ui/core';

import messages from './messages';

// uistyle
import Logo from '../../images/logo_512x512.png';
import Image from '../uiStyle/Images';
import Form from '../uiStyle/Form';
// images

import ShowPass from '../../images/icon/eye.svg';
import Pass from '../../images/icon/eye2.svg';

import './account.scss';
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';
import { loginStart } from '../../store/auth/auth.actions';
import { connect } from 'react-redux';

class LoginPage extends Component {
  state = {
    email: '',
    password: '',
    passwordShow: false,
    error: {},
    verifiedCaptcha: null,
  };

  t(msg, values) {
    return this.props.intl.formatMessage(msg, values);
  }

  handleClickShowPassword = current => {
    this.setState({
      [current]: !this.state[current],
    });
  };

  schema = {
    email: Joi.string()
      .required()
      .email()
      .error(errors => {
        errors.forEach(err => {
          switch (err.type) {
            case 'string.email':
              err.message = 'Email Must be Email Format';
              break;
            case 'any.required':
              err.message = 'Email is Requared';
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    password: Joi.string()
      .required()
      .min(8)
      .regex(/^[a-zA-Z0-9!@#$&()\\-`~.+,_]{3,30}$/)
      .error(errors => ({
        message: 'Please Provide a strong password',
      })),
  };

  changeHandler = event => {
    const error = { ...this.state.error };
    const errorMassage = this.validationProperty(event);
    if (errorMassage) {
      error[event.target.name] = errorMassage;
    } else {
      delete error[event.target.name];
    }
    this.setState({
      [event.target.name]: event.target.value,
      error,
    });
  };

  validationProperty = event => {
    const Obj = { [event.target.name]: event.target.value };
    const schema = { [event.target.name]: this.schema[event.target.name] };
    const { error } = Joi.validate(Obj, schema);
    return error ? error.details[0].message : null;
  };

  validate = () => {
    const options = { abortEarly: false };
    const form = {
      email: this.state.email,
      password: this.state.password,
    };
    const { error } = Joi.validate(form, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (const item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  submitHandler = event => {
    event.preventDefault();
    const error = this.validate();
    this.setState({
      error: error || {},
    });

    const { login } = this.props;
    if (!error) {
      this.state.history = this.props.history;
      const { email, password, history } = this.state;

      login({ email, password, history });
    }
  };

  onChangeCap = value => {
    this.setState({
      verifiedCaptcha: value,
    });
  };

  render() {
    const { email, password } = this.state;
    let token = '';
    try {
      token = localStorage.getItem('token');
    } catch (err) {
      console.log('un able to read token', err);
    }
    if (token) {
      return <Redirect to="/" />;
    }

    return (
      <Fragment>
        <Grid className="accountArea">
          <Grid className="container" container>
            <Grid item lg={6} xs={12}>
              <Grid className="accountImage">
                <div className="logo-left">
                  <img
                    src={Logo}
                    alt="logo"
                    style={({ width: '100px' }, { height: '100px' })}
                  />
                  <span>UltraNote Cloud</span>
                </div>

                <p>Manage users and walets with admin panel</p>
              </Grid>
            </Grid>
            <Grid item lg={6} xs={12}>
              <Grid className="accountContent">
                <Typography variant="h3">Sign In</Typography>
                <Typography className="text" paragraph>
                  Please sign in to your account.
                </Typography>
                <Form onSubmit={this.submitHandler}>
                  <TextField
                    style={{
                      width: '100%',
                      background: '#fff',
                      marginBottom: '1.5rem',
                    }}
                    label="Email"
                    className="inputStyle"
                    name="email"
                    variant="outlined"
                    onChange={this.changeHandler}
                    value={email}
                    helperText={
                      this.state.error.email ? this.state.error.email : ''
                    }
                  />
                  <TextField
                    style={{
                      width: '100%',
                      background: '#fff',
                      marginBottom: '1.5rem',
                    }}
                    label="Password"
                    className="inputStyle"
                    name="password"
                    variant="outlined"
                    type={this.state.passwordShow ? 'text' : 'password'}
                    onChange={this.changeHandler}
                    value={password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment className="showPassword" position="end">
                          <IconButton
                            onClick={() =>
                              this.handleClickShowPassword('passwordShow')
                            }
                          >
                            <Image
                              src={this.state.passwordShow ? Pass : ShowPass}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    helperText={
                      this.state.error.password ? this.state.error.password : ''
                    }
                  />
                  <ReCAPTCHA
                    style={{
                      width: '100%',
                      background: '#fff',
                      marginBottom: '1rem',
                    }}
                    className="recaptcha"
                    sitekey="6LdqlfoZAAAAAMLxltM3BSoqaFQInUh_lxtZ88cC"
                    onChange={this.onChangeCap}
                  />
                  <Grid className="forgotPassword">
                    <Link to="/forgot-password/reset">Forgot Password ?</Link>
                  </Grid>
                  <Button
                    type="submit"
                    className="submitButton"
                    disabled={!this.state.verifiedCaptcha}
                  >
                    Sign In
                  </Button>
                  <Typography variant="h6">
                    Don’t have account ? <Link to="/signup">Sign Up</Link>
                  </Typography>
                </Form>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  login: payload => dispatch(loginStart(payload)),
});

export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(LoginPage),
);
