import React, { Component, Fragment } from 'react';
import { injectIntl } from 'react-intl';
import messages from './messages';
import {
  Grid,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TextField,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import Pagination from 'components/Pagination';
import SweetAlert from 'sweetalert-react';
import { toast } from 'react-toastify';
import 'sweetalert/dist/sweetalert.css';
// json data
import userList from 'utils/json/userlist';

// images
import deleteUser from 'images/icon/delete-user.svg';
import search from 'images/icon/tabs/search.svg';
import view from 'images/icon/view.svg';
import edit from 'images/icon/edit.svg';
import blockUser from 'images/icon/block-user.svg';
import wallet from 'images/icon/wallet.svg';

import { clientHttp } from '../../utils/services/httpClient';

const searchingFor = search => user =>
  user.firstName.toLowerCase().includes(search.toLowerCase()) || !search;

class UserList extends Component {
  state = {
    search: '',
    pageOfItems: [],
    delete: false,
    suspend: false,
  };
  changeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onChangePage = pageOfItems => {
    this.setState({ pageOfItems: pageOfItems });
  };

  deleteModalShow = () => {
    this.setState({
      delete: true,
    });
  };
  deleteModalClose = () => {
    this.setState({
      delete: false,
    });
  };

  suspendModalShow = () => {
    this.setState({
      suspend: true,
    });
  };
  suspendModalClose = () => {
    this.setState({
      suspend: false,
    });
  };

  componentDidMount() {
    this.userList();
  }

  userList = async () => {
    try {
      const response = await clientHttp.post('/users/user_list');
      const userList = response.data.users;
      console.log(userList);
      this.setState({
        pageOfItems: userList,
      });
    } catch (err) {
      this.setState({
        pageOfItems: [],
      });
    }
  };

  actionOnUserHandler = async (userId, action) => {
    try {
      const response = await clientHttp.put(`/users/${action}`, { userId });
      const { message } = response.data;
      toast.success(message);
      this.suspendModalClose();
      this.deleteModalClose();
    } catch (err) {
      toast.error(err.message);
      this.suspendModalClose();
      this.deleteModalClos;
    }
  };
  render() {
    return (
      <Fragment>
        <Grid className="userTableWrap">
          <Grid className="tableHeader">
            <h3 className="title">User List</h3>
            <TextField
              variant="outlined"
              name="search"
              label="Search"
              className="searchInput"
              value={this.state.search}
              onChange={this.changeHandler}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <img src={search} alt="" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid className="tableResponsive">
            <Table className="tableStyle">
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email ID</TableCell>
                  <TableCell>Updated At</TableCell>
                  <TableCell>Activity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.pageOfItems
                  .filter(searchingFor(this.state.search))
                  .map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.firstName}</TableCell>
                      <TableCell>{item.lastName}</TableCell>
                      <TableCell>{item.mail}</TableCell>
                      <TableCell>{item._id}</TableCell>
                      <TableCell>
                        <ul className="activityList">
                          <li>
                            <Link to={`/user-profile/${item._id}`}>
                              <img src={view} alt="" />
                            </Link>
                          </li>
                          <li>
                            <Link to={`/user-profile-edit/${item._id}`}>
                              <img src={edit} alt="" />
                            </Link>
                          </li>
                          <li>
                            <Link to={`/user-wallet-list/${item._id}`}>
                              <img src={wallet} alt="" />
                            </Link>
                          </li>
                          <li onClick={this.suspendModalShow}>
                            <img src={blockUser} alt="" />
                          </li>
                          <li onClick={this.deleteModalShow}>
                            <img src={deleteUser} alt="" />
                          </li>
                        </ul>
                        <SweetAlert
                          show={this.state.delete}
                          title="Delete"
                          html
                          text="Do you want to delete ?"
                          type="error"
                          onConfirm={() =>
                            this.actionOnUserHandler(item._id, 'delete_user')
                          }
                          onCancel={this.deleteModalClose}
                          showCancelButton={true}
                          showLoaderOnConfirm={true}
                          confirmButtonText="Delete"
                        />
                        <SweetAlert
                          show={this.state.suspend}
                          title="Suspend"
                          html
                          showCancelButton={true}
                          text="Do you want to Suspend ?"
                          type="warning"
                          onConfirm={() =>
                            this.actionOnUserHandler(item._id, 'suspend_user')
                          }
                          onCancel={this.suspendModalClose}
                          showLoaderOnConfirm={true}
                          confirmButtonText="Suspend"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
        <Pagination
          rowShow={5}
          items={userList}
          onChangePage={this.onChangePage}
        />
      </Fragment>
    );
  }
}

export default injectIntl(UserList);
