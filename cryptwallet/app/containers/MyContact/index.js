/**
 *
 * MyContact
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { List, ListItem } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import saga from './saga';
import reducer from './reducer';


import './style.scss';
import { selectUser, selectContactList } from '../../store/auth/auth.selectors';
import { getContactList } from '../../store/auth/auth.actions';


const Row = [];

/* eslint-disable react/prefer-stateless-function */
export class MyContact extends React.Component {
  state = {
    currentPage: 1,
    rowsPerPage: 4,
    pageNumberOfPage: 1,
    contactList: []
  };

  componentDidMount() {
    const { getContact, connectedUser } = this.props;
    getContact(connectedUser.id);
  }

  componentWillReceiveProps(nextProps) {
    const { getContactList } = nextProps;
    this.setState({
      contactList: getContactList,
    });
  }

  paginateHandler = prop => event => {
    this.setState({
      currentPage: Number(event.target.id),
      pageNumberOfPage: prop,
    });
  };

  render() {
    const {
      currentPage,
      rowsPerPage,
      pageNumberOfPage,
      contactList,
    } = this.state;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = contactList.slice(indexOfFirstRow, indexOfLastRow);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(contactList.length / rowsPerPage); i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => (
      <ListItem
        key={number}
        id={number}
        className={pageNumberOfPage === number ? 'active' : ''}
        onClick={this.paginateHandler(number)}
      >
        {number}
      </ListItem>
    ));
    return (
      <Grid className="myContactBody">
        <Grid container alignItems="center" className="myContactHeader">
          <Grid item xs={12} sm={6}>
            <Typography className="section-title" component="h4">
              My Contact List
            </Typography>
          </Grid>
        </Grid>
        <Grid className="tableWrapper">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.walletsAddresses.map((address, index) => (<div key={index}>{address} <br /></div>))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid className="PaginationWrapper">
          <List>{renderPageNumbers}</List>
        </Grid>
      </Grid>
    );
  }
}

MyContact.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  connectedUser: selectUser(state),
  getContactList: selectContactList(state),
});

const mapDispatchToProps = (dispatch) => ({
  getContact: (payload) => dispatch(getContactList(payload))
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'myContact', reducer });
const withSaga = injectSaga({ key: 'myContact', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(MyContact);
