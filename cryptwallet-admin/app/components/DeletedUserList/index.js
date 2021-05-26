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
import Pagination from 'components/Pagination';
import SweetAlert from 'sweetalert-react';
import { Link } from 'react-router-dom';

import { toast } from 'react-toastify';
import 'sweetalert/dist/sweetalert.css';
// json data
import userList from 'utils/json/userlist';

// images
import search from 'images/icon/tabs/search.svg';
import view from 'images/icon/view.svg';
import active from 'images/icon/tabs/active.svg';
import edit from 'images/icon/edit.svg';
import wallet from 'images/icon/wallet.svg';
import { clientHttp } from '../../utils/services/httpClient';

const searchingFor = search => user =>
  user.firstName.toLowerCase().includes(search.toLowerCase()) || !search;

class DeletedUserList extends Component {
  state = {
    search: '',
    deletedUsers: [],
    active: false,
  };
  changeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  activeCartHandler = id => {
    let userList = this.state.deletedUsers.filter(item => item.id !== id);
    this.setState({
      deletedUsers: userList,
      active: false,
    });
    toast.success('user active successfully');
  };
  onChangePage = deletedUsers => {
    this.setState({ deletedUsers });
  };

  activeModalShow = () => {
    this.setState({
      active: true,
    });
  };
  activeModalClose = () => {
    this.setState({
      active: false,
    });
  };

  componentDidMount() {
    this.userList();
  }

  userList = async () => {
    try {
      const response = await clientHttp.post('/users/deleted_user');
      const userList = response.data.users;
      console.log(userList);
      this.setState({
        deletedUsers: userList,
      });
    } catch (err) {
      this.setState({
        deletedUsers: [],
      });
    }
  };
  render() {
    return (
      <Fragment>
        <Grid className="userTableWrap">
          <Grid className="tableHeader">
            <h3 className="title">Deleted User</h3>
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
                {this.state.deletedUsers
                  .filter(searchingFor(this.state.search))
                  .map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.firstName}</TableCell>
                      <TableCell>{item.lastName}</TableCell>
                      <TableCell>{item.mail}</TableCell>
                      <TableCell>
                        {new Date(item.updatedAt).toDateString()}
                      </TableCell>
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
                          <li onClick={this.activeModalShow}>
                            <img src={active} alt="" />
                          </li>
                        </ul>
                        <SweetAlert
                          show={this.state.active}
                          title="User Active"
                          html
                          text="Do you want to  active ?"
                          type="success"
                          onConfirm={() => this.activeCartHandler(item._id)}
                          onCancel={this.activeModalClose}
                          showCancelButton={true}
                          showLoaderOnConfirm={true}
                          confirmButtonText="Active"
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
          items={this.deletedUsers}
          onChangePage={this.onChangePage}
        />
      </Fragment>
    );
  }
}

export default injectIntl(DeletedUserList);
