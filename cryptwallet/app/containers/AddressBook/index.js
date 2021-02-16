/**
 *
 * AddressBook
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

// icons
import WalletAction from '../../images/icon/action/wallet-action.png';
import GroupAction from '../../images/icon/action/group-action.png';
import ShareAction from '../../images/icon/action/share-action.png';
import KeyAction from '../../images/icon/action/key-action.png';

import './style.scss';
import AddWallet from '../../components/AddWallet';
import MoveCoin from '../../components/MoveCoin';
import { isAmount } from '../../utils/commonFunctions';
import SingleWallet from '../SingleWallet';
import { toast } from 'react-toastify';
import {selectUser, selectAllUsers} from '../../store/auth/auth.selectors';
import {addContact, getContactList, getUsers} from '../../store/auth/auth.actions';

import MyContact from '../MyContact';
import UsersList from '../UsersList';

function TabContainer(props) {
  return (
    <Typography component="div">
      {props.children}
    </Typography>
  );
}

/* eslint-disable react/prefer-stateless-function */
export class AddressBook extends React.Component {
  state = {
    tab: 0
  };

  tabChangeHandler = (event, value) => {
    this.setState({ tab: value });
  };

  render() {
    const { tab } = this.state;
  
    return (
      <Grid className="addressBookWrapper">
      <Grid className="container">
        <AppBar className="addressBookTabsBar" position="static" color="default">
          <Typography className="addressBookTitle" component="p">
          </Typography>
          <Tabs
            value={tab}
            onChange={this.tabChangeHandler}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            className="tabsWrapper"
          >
            <Tab
              disableRipple
              label="Contact List"
              icon={<Image src={WalletAction} />}
            />
            <Tab
              disableRipple
              label="Users List"
              icon={<Image src={ShareAction} />}
            />
          </Tabs>
        </AppBar>
        {tab === 0 && (
          <TabContainer>
            <MyContact />
          </TabContainer>
        )}
        {tab === 1 && (
          <TabContainer>
            <UsersList />
          </TabContainer>
        )}
      </Grid>
      </Grid>
    );
  }
}

AddressBook.propTypes = {
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

const withReducer = injectReducer({ key: 'addressBook', reducer });
const withSaga = injectSaga({ key: 'addressBook', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddressBook);
