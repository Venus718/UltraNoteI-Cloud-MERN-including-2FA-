/**
 *
 * Billing
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Button, List, ListItem } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Image from '../../components/uiStyle/Images';
import messages from './messages';
import saga from './saga';
import reducer from './reducer';
import makeSelectMyWallet from './selectors';

import Images from '../../components/uiStyle/Images';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import ListItemText from '@material-ui/core/ListItemText';
// icons
import billing from '../../images/icon/invoice.png';

import './style.scss';
import AddWallet from '../../components/AddWallet';
import MoveCoin from '../../components/MoveCoin';
import { isAmount } from '../../utils/commonFunctions';
import SingleWallet from '../SingleWallet';
import { toast } from 'react-toastify';
import { selectUser, selectAllUsers } from '../../store/auth/auth.selectors';
import { addContact, getContactList, getUsers } from '../../store/auth/auth.actions';
import { withStyles } from '@material-ui/core/styles';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import { clientHttp } from './../../utils/services/httpClient'
import ImgsViewer from "react-images-viewer";

const styles = {
  message: {
    width: 'fit-content',
    "max-width": "240px",
    "border-radius": "10px",
    "margin-top": '6px',
    "margin-bottom": '6px',
    "padding-top": "5px !important",
    "padding-bottom": "5px !important",
    "padding-left": "10px !important",
    "padding-right": "10px !important",
  },
  messageright: {
    float: "right",
    backgroundColor: '#3B3363',

  },
  messageleft: {
    float: "left",
    backgroundColor: "#8c79eb",
  },
};

/* eslint-disable react/prefer-stateless-function */
export class Billing extends React.Component {


  async componentDidMount() {

    const { socket } = this.props;
    this.setState({ socket: socket });
    if (socket != null) {
      socket.on("ReceiveChatRoomMessage", (msg) => {
        this.setState((prevState) => ({
          messages: [...prevState.messages, msg],
        }));
      })
    }
    try {
      const result = await clientHttp.get("/wallets/getmessages");
      if (result) {
        this.setState((prevState) => ({
          messages: [...prevState.messages, ...result.data],
        }));
        this.scrollToBottom();
      }
    }
    catch (error) {

    }
  }

  componentWillUnmount() {
    this.props.socket?.off('ReceiveChatRoomMessage', () => { });
  }

  state = {
    inputValue: '',
    viewerIsOpen: false,
    socket: null,
    currentImage: "",
    messages: [],
  };

  scrollToBottom = () => {
    let element = document.getElementsByClassName("messageArea")[0];
    if (element) {
      // Set the scroll position to the bottom
      element.scrollTop = element.scrollHeight;
    }
  };

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Do something with the inputValue when Enter is pressed
      this.submitButton();
    }
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  isNotEmptyOrSpaces = (value) => {
    // Check if the value is not null, undefined, or an empty string
    if (value === null || value === undefined || value.trim() === '') {
      return false;
    }
    return true;
  }

  submitButton = () => {

    if (this.isNotEmptyOrSpaces(this.state.inputValue)) {
      this.sendMessage(this.state.inputValue, 'text')
      this.setState({ inputValue: "" });
    }
  }

  sendMessage = (msg, type) => {
    // alert('Entered: ' + this.state.inputValue);
    const socket = this.state.socket
    if (socket != null) {
      let time = Date.now()
      let data = { type: type, message: msg, time: time };
      const { connectedUser } = this.props;
      let nmsg = {
        userId: connectedUser?._id,
        name: (connectedUser.firstName + " " + connectedUser.lastName).trim(),
        msgType: type,
        message: msg,
        time: time,
      };
      this.setState((prevState) => ({
        messages: [...prevState.messages, nmsg],
      }));
      this.scrollToBottom();
      socket.emit('SendChatRoomMessage', JSON.stringify(data));
    }
  }

  formatDate = (value) => {
    const date = new Date(parseInt(value.toString().trim()));
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true, // Use 24-hour time format
    };

    let formattedDateTime = date.toLocaleString('en-US', options).replace(" at", "");
    return formattedDateTime;
  }

  handleImageChange = e => {
    e.preventDefault();

    // FileList to Array
    const files = Array.from(e.target.files);

    files.forEach((file, i) => {
      const reader = new FileReader();
      if (file.size > 5005000) {
        toast.warn("Image size should be less than 5mb");
      }
      else {
        reader.onloadend = () => {
          this.sendMessage(reader.result, 'image')
        };
        reader.readAsDataURL(file);
      }
    });
  };

  closeViewer = () => {
    this.setState({ viewerIsOpen: false });
  }

  OpenViewer = (value) => {
    this.setState({ viewerIsOpen: true, currentImage: value })
  }

  render() {
    const { classes, connectedUser } = this.props;
    return (
      <>
        <Grid className="billingWrapper">
          <Grid className="container">
            <AppBar className="billingTabsBar" position="static" color="default">
              <Typography className="billingTitle" variant="h3" component="p">
                Chat Room
              </Typography>
            </AppBar>
            <Grid className="billingBody">
              <Grid container alignItems="center" className="billingHeader">
                <Grid item xs={12}>
                  <List className={'messageArea'}>
                    {this.state.messages.map((item, index) => (
                      item.userId == connectedUser._id ?
                        <ListItem key={index} className='singlemsg rightmsg' id={"msgnb-" + index}>
                          <Grid container className={classes.message + " " + classes.messageright}>
                            <Grid item xs={12}>
                              {item.msgType == "text" ?
                                <ListItemText disableTypography style={{ color: "white" }} align="left" primary={item.message}></ListItemText>
                                : <img src={item.message} onClick={() => this.OpenViewer(item.message)} alt="Image" style={{ borderRadius: '10px', cursor: 'pointer' }} />}
                            </Grid>
                            <Grid item xs={12}>
                              <ListItemText disableTypography style={{ color: "white" }} align="right" secondary={this.formatDate(item.time)}></ListItemText>
                            </Grid>
                          </Grid>
                        </ListItem>
                        : <ListItem key={index} className='singlemsg leftmsg'>
                          <Grid container className={classes.message + " " + classes.messageleft}>
                            <Grid item xs={12}>
                              <ListItemText disableTypography style={{ color: "white" }} align="left" primary={item.name}></ListItemText>
                            </Grid>
                            <Grid item xs={12} style={{ width: "auto" }}>
                              {item.msgType == "text" ?
                                <ListItemText disableTypography style={{ color: "white" }} align="left" primary={item.message}></ListItemText>
                                : <img src={item.message} onClick={() => this.OpenViewer(item.message)} alt='Image' style={{ borderRadius: '10px', cursor: 'pointer' }} />}
                            </Grid>
                            <Grid item xs={12}>
                              <ListItemText disableTypography style={{ color: "white" }} align="right" secondary={this.formatDate(item.time)}></ListItemText>
                            </Grid>
                          </Grid>
                        </ListItem>
                    ))}
                  </List>
                  <Divider />
                  <Grid container style={{ marginTop: '15px' }}>
                    <Grid xs={1} style={{ marginTop: '10px' }} item>
                      <Fab color="primary" aria-label="add"><PhotoLibraryIcon /> <input
                        accept=".jpeg,.jpg,.png,.svg,.gif"
                        type="file"
                        className="msg-input-image"
                        onChange={this.handleImageChange} /></Fab>
                    </Grid>
                    <Grid item xs={10}>
                      <TextField id="outlined-basic-email" label="Type Something" fullWidth onChange={this.handleInputChange}
                        value={this.state.inputValue}
                        onKeyDown={this.handleKeyDown} />
                    </Grid>
                    <Grid xs={1} align="right" style={{ marginTop: '10px' }} item>
                      <Fab color="primary" aria-label="add" onClick={this.submitButton}><SendIcon /></Fab>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

        </Grid>
        {/* <ModalGateway>
          {this.state.viewerIsOpen ? (
            <Modal>
              <Carousel
                currentIndex={this.state.currentImage}
                views={this.state.messages.filter(o => o.msgType == 'image').map(x => ({
                  src: x.message,
                }))} />
            </Modal>
          ) : null}
        </ModalGateway> */}
        <ImgsViewer
          imgs={[
            {
              src: this.state.currentImage,
            },
          ]}
          isOpen={this.state.viewerIsOpen}
          backdropCloseable={true}
          onClose={this.closeViewer}
        />

      </>
    );
  }
}

Billing.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  connectedUser: selectUser(state),
});

const mapDispatchToProps = (dispatch) => ({
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'billing', reducer });
const withSaga = injectSaga({ key: 'billing', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(Billing);
