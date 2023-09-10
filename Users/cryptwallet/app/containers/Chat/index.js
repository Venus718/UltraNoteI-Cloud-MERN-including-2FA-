/**
 *
 * Chat
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
import { Button, IconButton, List, ListItem } from '@material-ui/core';
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
import Drawer from '@material-ui/core/Drawer';
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
import chat from '../../images/icon/invoice.png';

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
import CloseIcon from '@material-ui/icons/Close';
import { clientHttp } from './../../utils/services/httpClient'
import ImgsViewer from "react-images-viewer";


import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';


import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

/* eslint-disable react/prefer-stateless-function */
export class Chat extends React.Component {



    async componentDidMount() {
        const { connectedUser } = this.props;
        const { socket } = this.props;
        this.setState({ socket: socket });
        if (socket != null) {
            socket.on("ReceiveChatRoomMessage", this.handleReceiveChatRoomMessage);
            socket.on("ReceiveOnlineUser", this.handleReceiveOnlineUser);
            socket.on("ReceiveRemoveUser", this.handleReceiveRemoveUser);
            socket.on("ReceiveDeleteMessage", this.handleReceiveDeleteMessage);
            socket.on("ReceiveUpdateMessage", this.handleReceiveUpdateMessage);
            socket.on("ReceiveMuteStatus", this.handleReceiveMuteStatus);
        }
        try {
            socket.emit("GetAllUser", {})
            const result = await clientHttp.get("/wallets/getmessages");
            if (result) {
                this.setState((prevState) => ({
                    messages: [...prevState.messages, ...result.data.messages],
                    IsMuted: result.data.IsMuted,
                    IsAdmin: result.data.IsAdmin,
                }));
            }
            this.scrollToBottom();
        }
        catch (error) {

        }
    }

    componentWillUnmount() {
        const { socket } = this.props;
        socket?.off("ReceiveChatRoomMessage", this.handleReceiveChatRoomMessage);
        socket?.off("ReceiveOnlineUser", this.handleReceiveOnlineUser);
        socket?.off("ReceiveRemoveUser", this.handleReceiveRemoveUser);
        socket?.off("ReceiveDeleteMessage", this.handleReceiveDeleteMessage);
        socket?.off("ReceiveUpdateMessage", this.handleReceiveUpdateMessage);
        socket?.off("ReceiveMuteStatus", this.handleReceiveMuteStatus);
    }

    state = {
        inputValue: '',
        viewerIsOpen: false,
        socket: null,
        currentImage: "",
        userModel: false,
        IsMuted: true,
        IsAdmin: false,
        DeleteModel: false,
        UpdateModel: false,
        deleteMessageId: null,
        updateMessageId: null,
        UpdateMsg: "",
        messages: [],
        userList: [],
    };


    handleReceiveChatRoomMessage = (msg) => {
        this.setState((prevState) => ({
            messages: [...prevState.messages, msg],
        }));
    };

    handleReceiveOnlineUser = (user, clear) => {
        this.setState((prevState) => ({
            userList: [...prevState.userList.filter(o => o.userId !== user.userId), user],
        }));
    };

    handleReceiveRemoveUser = (userId) => {
        this.setState((prevState) => ({
            userList: [...prevState.userList.filter(user => user.userId !== userId)],
        }));
    };

    handleReceiveDeleteMessage = (msgId) => {
        this.setState((prevState) => ({
            messages: [...prevState.messages.filter(msg => msg.msgId !== msgId)]
        }));
    };

    handleReceiveUpdateMessage = (msg) => {
        this.setState((prevState) => ({
            messages: prevState.messages.map((m) =>
                m.msgId === msg.msgId ? { ...m, isEdited: true, message: msg.msg } : m
            ),
        }));
    };

    handleReceiveMuteStatus = (obj) => {
        this.setState({ IsMuted: obj.ismute });
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
            let msgId = this.create_UUID();
            let data = { msgId: msgId, type: type, message: msg, time: time };
            const { connectedUser } = this.props;
            let nmsg = {
                msgId: msgId,
                userId: connectedUser?.id,
                name: (connectedUser.firstName + " " + connectedUser.lastName).trim(),
                msgType: type,
                message: msg,
                time: time,
                isEdited: false,
            };
            this.setState((prevState) => ({
                messages: [...prevState.messages, nmsg],
            }));
            socket.emit('SendChatRoomMessage', JSON.stringify(data));
            this.scrollToBottom();
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

    handleMute = (userId, muteStatus) => {
        const socket = this.state.socket;
        let mute = muteStatus === 'mute' ? true : false;
        this.setState((prevState) => ({
            userList: prevState.userList.map((user) =>
                user.userId === userId ? { ...user, IsMuted: mute } : user
            ),
        }));
        socket.emit("ChangeMuteStatus", { userId: userId, muteStatus: muteStatus })
    }
    DeleteMessage = () => {
        const socket = this.state.socket
        this.setState({ DeleteModel: false });
        let messageId = this.state.deleteMessageId;
        if (messageId != null) {
            this.setState((prevState) => ({
                messages: [...prevState.messages.filter(msg => msg.msgId !== messageId)]
            }));
        }
        socket.emit("DeleteMessage", messageId)
    }

    DeleteMessageModel = (messageId) => {
        this.setState({ deleteMessageId: messageId, DeleteModel: true })
    }

    create_UUID = () => {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    EditMessageModel = (messageId, msg) => {
        this.setState({ updateMessageId: messageId, UpdateMsg: msg, UpdateModel: true })
    }

    EditMessage = () => {
        const socket = this.state.socket
        this.setState({ UpdateModel: false });
        let messageId = this.state.updateMessageId;
        let msg = this.state.UpdateMsg;
        if (messageId != null && this.isNotEmptyOrSpaces(this.state.UpdateMsg)) {
            this.setState((prevState) => ({
                messages: prevState.messages.map((m) =>
                    m.msgId === messageId ? { ...m, isEdited: true, message: msg } : m
                ),
            }));
            let newmsg = { msg: msg, msgId: messageId };
            socket.emit("UpdateMessage", newmsg)
        }
    }

    render() {
        const { classes, connectedUser } = this.props;
        return (
            <>
                <Dialog
                    open={this.state.DeleteModel}
                    TransitionComponent={Transition}
                    keepMounted
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{"Are you sure you want to delete this message?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Click "Delete" to permanently remove this message. This message cannot be recovered.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ DeleteModel: false })}>Cancel</Button>
                        <Button onClick={this.DeleteMessage}>Delete</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.UpdateModel}
                    TransitionComponent={Transition}
                    keepMounted
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{"Update Message"}</DialogTitle>
                    <DialogContent>
                        <Grid item xs={12} style={{ margin: "5px" }}>
                            <TextField id="outlined-basic-basic-msg" label="Type Something" fullWidth onChange={(e) => this.setState({ UpdateMsg: e.target.value })}
                                value={this.state.UpdateMsg} />
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ UpdateModel: false })}>Cancel</Button>
                        <Button onClick={this.EditMessage}>Update</Button>
                    </DialogActions>
                </Dialog>
                <Grid className="chatWrapper">
                    <Grid className="container">

                        <AppBar className="chatTabsBar" position="static" color="default">
                            <div className="chatTitle">
                                <span style={{ fontSize: "18px" }}>Chat Room</span>
                            </div>
                        </AppBar>
                        <Grid container className="chatBody">
                            <Grid item xs={9} container alignItems="center" className="chatHeader">
                                <Grid item xs={12}>
                                    <List className={'messageArea'}>
                                        {this.state.messages.map((item, index) => (
                                            item.userId === connectedUser?.id ?
                                                <ListItem key={index} className='singlemsg rightmsg' id={"msgnb-" + index}>
                                                    <Grid container className={classes.message + " " + classes.messageright}>
                                                        <Grid item xs={12} style={{ marginBottom: '7px' }}>
                                                            <img src={connectedUser.image} onClick={() => this.OpenViewer(connectedUser.image)} alt='User Image' style={{ borderRadius: '50%', cursor: 'pointer', width: '30px' }} />
                                                            <span style={{ color: "white" }} > {(connectedUser.firstName + " " + connectedUser.lastName).trim()}</span>
                                                            <IconButton
                                                                style={{
                                                                    color: "white",
                                                                    padding: "0px",
                                                                    float: "right",
                                                                }}
                                                                edge="end"
                                                                aria-label="mute"
                                                                onClick={() => this.DeleteMessageModel(item.msgId)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                            {
                                                                item.msgType == "text" ?
                                                                    <IconButton
                                                                        style={{
                                                                            color: "white",
                                                                            padding: "0px",
                                                                            float: "right",
                                                                        }}
                                                                        edge="end"
                                                                        aria-label="mute"
                                                                        onClick={() => this.EditMessageModel(item.msgId, item.message)}
                                                                    >
                                                                        <EditIcon />
                                                                    </IconButton> : null
                                                            }
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            {item.msgType == "text" ?
                                                                <ListItemText disableTypography style={{ color: "white" }} align="left" primary={item.message}></ListItemText>
                                                                : <img src={item.message} onClick={() => this.OpenViewer(item.message)} alt="Image" style={{ borderRadius: '10px', cursor: 'pointer' }} />}
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <ListItemText disableTypography style={{ color: "white", fontSize: '12px' }} align="right" secondary={this.formatDate(item.time)}></ListItemText>
                                                        </Grid>
                                                    </Grid>
                                                </ListItem>
                                                : <ListItem key={index} className='singlemsg leftmsg'>
                                                    <Grid container className={classes.message + " " + classes.messageleft}>
                                                        <Grid item xs={12} style={{ marginBottom: '7px' }}>
                                                            <img src={item.picture} onClick={() => this.OpenViewer(item.picture)} alt='User Image' style={{ borderRadius: '50%', cursor: 'pointer', width: '30px' }} />
                                                            <span style={{ color: "white" }} > {item.name}</span>
                                                            {
                                                                this.state.IsAdmin ?
                                                                    <>
                                                                        <IconButton
                                                                            style={{
                                                                                color: "white",
                                                                                padding: "0px",
                                                                                float: "right",
                                                                            }}
                                                                            edge="end"
                                                                            aria-label="mute"
                                                                            onClick={() => this.DeleteMessageModel(item.msgId)}
                                                                        >
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                        {
                                                                            item.msgType == "text" ?
                                                                                <IconButton
                                                                                    style={{
                                                                                        color: "white",
                                                                                        padding: "0px",
                                                                                        float: "right",
                                                                                    }}
                                                                                    edge="end"
                                                                                    aria-label="mute"
                                                                                    onClick={() => this.EditMessageModel(item.msgId, item.message)}
                                                                                >
                                                                                    <EditIcon />
                                                                                </IconButton> : null}</> : null
                                                            }
                                                        </Grid>
                                                        <Grid item xs={12} style={{ width: "auto" }}>
                                                            {item.msgType == "text" ?
                                                                <ListItemText disableTypography style={{ color: "white" }} align="left" primary={item.message}></ListItemText>
                                                                : <img src={item.message} onClick={() => this.OpenViewer(item.message)} alt='Image' style={{ borderRadius: '10px', cursor: 'pointer' }} />}
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <ListItemText disableTypography style={{ color: "white", fontSize: '12px' }} align="right" secondary={this.formatDate(item.time)}></ListItemText>
                                                        </Grid>
                                                    </Grid>
                                                </ListItem>
                                        ))}
                                    </List>
                                    {
                                        !(this.state.IsMuted) ?

                                            <><Divider /><Grid container style={{ marginTop: '15px' }}>
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
                                            </Grid></> : null
                                    }
                                </Grid>
                            </Grid>
                            <Grid item xs={3} className='onlineUserList'>
                                <><h3 style={{ textAlign: 'center' }}>Online Users</h3><List>
                                    {this.state.userList.filter(a => a.userId !== connectedUser?.id).sort((a, b) => a.name.localeCompare(b.name)).map((user) => (
                                        <ListItem key={user.userId}>
                                            <ListItemAvatar>
                                                <Avatar alt={user.name} src={user.picture} />
                                            </ListItemAvatar>
                                            <ListItemText primary={user.name} />
                                            {
                                                this.state.IsAdmin ?
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="mute"
                                                        color={user.IsMuted ? 'primary' : 'default'}
                                                        onClick={() => this.handleMute(user.userId, (user.IsMuted === true ? 'unmute' : 'mute'))}
                                                    >
                                                        <VolumeOffIcon />
                                                    </IconButton> : <></>
                                            }
                                        </ListItem>
                                    ))}
                                </List></>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
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

Chat.propTypes = {
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

const withReducer = injectReducer({ key: 'chat', reducer });
const withSaga = injectSaga({ key: 'chat', saga });

export default compose(
    withReducer,
    withSaga,
    withConnect,
    withStyles(styles),
)(Chat);
