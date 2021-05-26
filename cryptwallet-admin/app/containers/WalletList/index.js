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
import './style.scss';

import search from 'images/icon/tabs/search.svg';
import view from 'images/icon/view.svg';
import { clientHttp } from '../../utils/services/httpClient';

const searchingFor = search => wallet =>
  wallet.name.toLowerCase().includes(search.toLowerCase()) || !search;

class WalletList extends Component {
  state = {
    search: '',
    wallets: [],
  };
  changeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onChangePage = wallets => {
    this.setState({ wallets });
  };
  componentDidMount() {
    this.walletList();
  }

  walletList = async () => {
    try {
      const response = await clientHttp.post('/wallets/wallet_list');
      const walletList = response.data.wallets;
      this.setState({
        wallets: walletList,
      });
    } catch (err) {
      this.setState({
        wallets: [],
      });
    }
  };

  render() {
    return (
      <Fragment>
        <Grid className="cartStyle pb-30 tablePedingWrap">
          <Grid className="tableHeader">
            <h3 className="title"> Wallets</h3>
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
                  <TableCell>Wallet Name</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Updated At</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Activity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.wallets
                  .filter(searchingFor(this.state.search))
                  .map((wallet, i) => (
                    <TableRow key={i}>
                      <TableCell>{wallet.name}</TableCell>
                      <TableCell>
                        {new Date(wallet.createdAt).toDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(wallet.updatedAt).toDateString()}
                      </TableCell>
                      <TableCell>{wallet.balance}</TableCell>
                      <TableCell>
                        <ul className="activityList">
                          <li>
                            <Link to={`all-transaction/${wallet._id}`}>
                              <img src={view} alt="" />
                            </Link>
                          </li>
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
        <Pagination
          rowShow={5}
          items={this.wallets}
          onChangePage={this.onChangePage}
          className="plr-0"
        />
      </Fragment>
    );
  }
}

export default injectIntl(WalletList);
