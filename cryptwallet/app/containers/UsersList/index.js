/**
 *
 * UsersList
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Button, List, ListItem } from '@material-ui/core';
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
import { selectUser, selectAllUsers } from '../../store/auth/auth.selectors';
import { addContact, getUsers } from '../../store/auth/auth.actions';


const Row = [];

/* eslint-disable react/prefer-stateless-function */
export class UsersList extends React.Component {
  state = {
    currentPage: 1,
    rowsPerPage: 4,
    pageNumberOfPage: 1,
    users: []
  };


  componentDidMount() {
    const { getUsers } = this.props;
    getUsers();

  }

  componentWillReceiveProps(nextProps) {
    const { getUsersList } = nextProps;
    this.setState({
      users: getUsersList
    });
  }

  paginateHandler = prop => event => {
    this.setState({
      currentPage: Number(event.target.id),
      pageNumberOfPage: prop,
    });
  };

  addToContactList = (row) => {

    const { connectedUser } = this.props;
    const { addContact } = this.props;

    const addedContact = {
      id: connectedUser.id,
      contact_id: row._id,
    };

    addContact(addedContact);

  };


  render() {
    const {
      currentPage,
      rowsPerPage,
      pageNumberOfPage,
      users,
    } = this.state;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = users.slice(indexOfFirstRow, indexOfLastRow);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(users.length / rowsPerPage); i++) {
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
      <Grid className="userBody">
        <Grid container alignItems="center" className="userHeader">
          <Grid item xs={12} sm={6}>
            <Typography className="section-title" component="h4">
              Users List
            </Typography>
          </Grid>
        </Grid>
        <Grid className="tableWrapper">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.firstName}</TableCell>
                  <TableCell>{row.lastName}</TableCell>
                  <TableCell>
                    <List className="actionBtns">
                      <ListItem>
                        <Button
                          onClick={() => { this.addToContactList(row) }}
                          className="btn btnBlue btnWidth">
                          Add To Contact List
                              </Button>
                      </ListItem>
                    </List>
                  </TableCell>
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

UsersList.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  connectedUser: selectUser(state),
  getUsersList: selectAllUsers(state),
});

const mapDispatchToProps = (dispatch) => ({
  getUsers: () => dispatch(getUsers()),
  addContact: (payload) => dispatch(addContact(payload)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'usersList', reducer });
const withSaga = injectSaga({ key: 'usersList', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(UsersList);
