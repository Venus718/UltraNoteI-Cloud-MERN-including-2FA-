import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { compose } from 'redux';
import messages from './messages';
import { Grid } from '@material-ui/core';

import Featured from 'components/Featured/Loadable';
import UserChart from 'components/UserChart/Loadable';
import ActiveUser from 'components/ActiveUser/Loadable';
import DeleteUser from 'components/DeleteUser/Loadable';
import Deposit from 'components/Deposit/Loadable';
import Withdraw from 'components/Withdraw/Loadable';
import { clientHttp } from '../../utils/services/httpClient';
import './style.scss';
import { toast } from 'react-toastify';

const Dashboard = props => {
  const [dashboardData, setDashboardData] = useState({
    totalUser: 0,
    deletedUser: 0,
    activeUser: 0,
    companyProfit: 0,
  });
  useEffect(() => {
    dashboardState();
  }, []);
  const dashboardState = async () => {
    try {
      const response = await clientHttp.post('/dashboard');
      console.log({ response });
      const {
        totalUser,
        deletedUser,
        activeUser,
        companyProfit,
      } = response.data;
      setDashboardData({
        totalUser,
        deletedUser,
        activeUser,
        companyProfit,
      });
    } catch (err) {
      toast.error(
        err.message ||
          'Erro occured while getting dashboard data, please try again later ',
      );
    }
  };
  return (
    <Fragment>
      <Helmet>
        <title>
          {props.intl.formatMessage({
            ...messages.dashboard,
          })}
        </title>
      </Helmet>
      <Grid container spacing={4}>
        <Featured
          companyProfit={dashboardData.companyProfit}
          totalUser={dashboardData.totalUser}
        />
        <Grid item xs={12}>
          <UserChart />
        </Grid>
        <Grid item lg={6} xs={12}>
          <ActiveUser activeUser={dashboardData.activeUser} />
        </Grid>
        <Grid item lg={6} xs={12}>
          <DeleteUser deletedUser={dashboardData.deletedUser} />
        </Grid>
        <Grid item xs={12}>
          <Deposit />
        </Grid>
        <Grid item xs={12}>
          <Withdraw />
        </Grid>
      </Grid>
    </Fragment>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(injectIntl(Dashboard));
