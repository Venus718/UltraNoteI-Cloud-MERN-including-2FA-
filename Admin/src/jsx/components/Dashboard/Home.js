import React, {
  Fragment,
  Component,
  useState,
  useEffect,
  useContext,
} from "react";
import { Link } from "react-router-dom";
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import Donut from "../zenix/MyWallets/Donut";
import axios from "axios";
import { createStructuredSelector } from "reselect";
import Card1 from "./../../../images/card/card1.jpg";
import Card2 from "./../../../images/card/card2.jpg";
import Card3 from "./../../../images/card/card3.jpg";
import Card4 from "./../../../images/card/card4.jpg";
import { Row, Col, Card } from "react-bootstrap";
import BarChart1 from "../charts/Chartjs/bar1";
import { ThemeContext } from "../../../context/ThemeContext";
import { allUsers } from "../../../redux/home/home.actions";
import { selectUserToken } from "../../../redux/user/user.selectors";
import { selectTotalUsers } from "../../../redux/home/home.selectors";
import { totalBalance } from "../../../redux/home/home.actions";
import { selectTotalBalance } from "../../../redux/home/home.selectors";
import { totalActiveUsers } from "../../../redux/home/home.actions";
import { selectTotalActiveUsers } from "../../../redux/home/home.selectors";
import WithSpinner from "../spinner/spinner";
import { totataldeposits } from "../../../redux/home/home.actions";
import { selectTotalDepositsAmount } from "../../../redux/home/home.selectors";
import { selectTotalWithdrawsAmount } from "../../../redux/home/home.selectors";
import DualLineWithdraw from "../../components/charts/Chartjs/dualLinewithdraw";
import DualLineDeposit from "../../components/charts/Chartjs/dualLine";
import PageTitle from "../../layouts/PageTitle";
import { setUserProfileData } from "../../../redux/user/user.actions";
import TotalUsers from "../zenix/WidgetBasic/TotalUsers";
const MarketOverviewChart = loadable(() =>
  pMinDelay(import("../zenix/Home/MarketOverviewChart"), 1000)
);
const CurrentChart = loadable(() =>
  pMinDelay(import("../zenix/Home/CurrentChart"), 1000)
);

const orderdataBlog = [
  { price: "82.1", amount: "58.9", total: "134.10" },
  { price: "85.2", amount: "55.8", total: "136,12" },
  { price: "87.3", amount: "53.7", total: "138,12" },
  { price: "89.4", amount: "51.6", total: "139,12" },
  { price: "91.9", amount: "47.1", total: "140,12" },
  { price: "93.8", amount: "46.2", total: "142,12" },
  { price: "94.7", amount: "45.3", total: "145,12" },
  { price: "97.6", amount: "44.4", total: "147,12" },
];

const Home = ({
  tokem,
  allUsers,
  totaluser,
  balancedata,
  totalBalance,
  totalActiveUsers,
  activeusers,
  totataldeposits,
  totalwithdrawdata,
  totaldepositsdata,
  setUserProfileData,
}) => {
  console.log(totaluser, balancedata, activeusers);
  console.log(totaldepositsdata, totalwithdrawdata);
  const [suspendedUser, setSuspendedUser] = useState();
  let notActiveUsers = totaluser - activeusers;
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    console.log("mounted");

    // Update the document title using the browser API
    axios
      .get(`https://portal.ultranote.org/api/users/user_list`, {
        headers: {
          Authorization: tokem.token,
        },
      })
      .then((res) => {
        const persons = res.data;
        console.log(persons);
        allUsers(persons);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    axios
      .get(`https://portal.ultranote.org/api/users/activeUsers`, {
        headers: {
          Authorization: tokem.token,
        },
      })
      .then((res) => {
        const activeusers = res.data;
        console.log(activeusers);
        totalActiveUsers(activeusers);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    axios
      .get(
        `https://portal.ultranote.org/api/wallets/transactions/XuniihE4LneQDtUjFTiPGufSxpfQ52u2uSibdiVqv3WkFMuo5yQRhz2NHeJAzrh8Ar2UqhYpiWAvNgZzqdydmeyAZL4TJQh15Ab`,
        {
          headers: {
            Authorization: tokem.token,
          },
        }
      )
      .then((res) => {
        const depositsdata = res.data;
        console.log("Deposit DATA =>", depositsdata);
        totataldeposits(depositsdata);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    axios
      .get(`https://portal.ultranote.org/api/admin/profiledetails`, {
        headers: {
          Authorization: tokem.token,
        },
      })
      .then((res) => {
        const userprofiledata = res.data;
        console.log("User Profile DATA =>", userprofiledata.products[0]);
        setUserProfileData(userprofiledata.products[0]);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    axios
      .post(
        `https://portal.ultranote.org/api/users/suspended_user`,
        { hhj: "kol" },
        {
          headers: {
            Authorization: tokem.token,
          },
        }
      )
      .then((res) => {
        const suspended_user = res.data.users.length;
        console.log("suspended_user", suspended_user);
        setSuspendedUser(suspended_user);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    return () => console.log("unmounting...");
  }, []);

  const { background } = useContext(ThemeContext);
  const [crrency1, setCrrency1] = useState("Monthly (2021)");
  const [crrency2, setCrrency2] = useState("Monthly (2021)");
  const [crrency3, setCrrency3] = useState("Monthly (2021)");
  const [crrency4, setCrrency4] = useState("Monthly (2021)");

  const [country1, setCountry1] = useState("Medan, IDN");
  const [country2, setCountry2] = useState("Jakarta, IDN");
  const [country3, setCountry3] = useState("Surabaya, IDN");

  //   console.log(activeusers);
  if (totaluser && activeusers && totaldepositsdata) {
    return (
      <Fragment>
        <PageTitle activeMenu="Dashboard" motherMenu="App" />

        <div className="col-xl-6 col-xxl-12">
          <div className="row">
            <div className="col-sm-6">
              <div className="widget-stat card bg-primary">
                <div className="card-header border-0 pb-0">
                  <h3 className="card-title text-white">Total Users</h3>
                  <h5 className="text-white mb-0">{totaluser}</h5>
                </div>
                <div className="card-body text-center">
                  <div className="ico-sparkline">
                    <TotalUsers
                      activeUsers={activeusers}
                      suspendedUsers={suspendedUser}
                      notActiveUsers={notActiveUsers}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-sm-6" >
								<div className="card-bx stacked card">
									<img src={Card2} alt="" />
									<div className="card-info">
										<p className="mb-1 text-white fs-14">Total Balance</p>
										<div className="d-flex justify-content-between">
											<h2 className="num-text text-white mb-5 font-w600">{balancedata}</h2>
											<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M19.2744 18.8013H16.0334V23.616H19.2744C19.9286 23.616 20.5354 23.3506 20.9613 22.9053C21.4066 22.4784 21.672 21.8726 21.672 21.1989C21.673 19.8813 20.592 18.8013 19.2744 18.8013Z" fill="white"/>
												<path d="M18 0C8.07429 0 0 8.07429 0 18C0 27.9257 8.07429 36 18 36C27.9257 36 36 27.9247 36 18C36 8.07531 27.9247 0 18 0ZM21.6627 26.3355H19.5398V29.6722H17.3129V26.3355H16.0899V29.6722H13.8528V26.3355H9.91954V24.2414H12.0898V11.6928H9.91954V9.59863H13.8528V6.3288H16.0899V9.59863H17.3129V6.3288H19.5398V9.59863H21.4735C22.5535 9.59863 23.5491 10.044 24.2599 10.7547C24.9706 11.4655 25.416 12.4611 25.416 13.5411C25.416 15.6549 23.7477 17.3798 21.6627 17.4744C24.1077 17.4744 26.0794 19.4647 26.0794 21.9096C26.0794 24.3453 24.1087 26.3355 21.6627 26.3355Z" fill="white"/>
												<path d="M20.7062 15.8441C21.095 15.4553 21.3316 14.9338 21.3316 14.3465C21.3316 13.1812 20.3842 12.2328 19.2178 12.2328H16.0334V16.4695H19.2178C19.7959 16.4695 20.3266 16.2226 20.7062 15.8441Z" fill="white"/>
											</svg>
										</div>
										<div className="d-flex">
											<div className="mr-4 text-white">
												<p className="fs-12 mb-1 op6">VALID THRU</p>
												<span>08/21</span>
											</div>
											<div className="text-white">
												<p className="fs-12 mb-1 op6">CARD HOLDER</p>
												<span>Marquezz Silalahi</span>
											</div>
										</div>
									</div>
								</div>
							</div> */}
          </div>
          <Row>
            <Col xl={12} lg={6}>
              <Card>
                <Card.Header>
                  <h4 className="card-title">Total Users</h4>
                </Card.Header>
                <Card.Body>
                  <BarChart1 users={totaluser} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        <div className="col-xl-12">
          <div className="card">
            <div className="card-body">
              <div className="row align-items-end">
                <div className="col-xl-6 col-lg-12 col-xxl-12 mb-lg-0 mb-3">
                  <p>Monthly Limits</p>
                  <div className="row">
                    <div className="col-sm-6 mb-sm-0 mb-4 text-center">
                      <div className="d-inline-block position-relative donut-chart-sale mb-3">
                        {background.value === "dark" ? (
                          <Donut
                            value={((activeusers / totaluser) * 100).toFixed(0)}
                            backgroundColor="#FF6826"
                            backgroundColor2="#F0F0F0"
                          />
                        ) : (
                          <Donut
                            value={((activeusers / totaluser) * 100).toFixed(0)}
                            backgroundColor="#FF6826"
                          />
                        )}
                        {((activeusers / totaluser) * 100).toFixed(0)}%
                      </div>
                      <h5 className="fs-18 text-black">Active Users</h5>
                      <span>{activeusers}</span>
                    </div>
                    <div className="col-sm-6 mb-sm-0 mb-4 text-center">
                      <div className="d-inline-block position-relative donut-chart-sale mb-3">
                        {background.value === "dark" ? (
                          <Donut
                            value={((suspendedUser / totaluser) * 100).toFixed(
                              0
                            )}
                            backgroundColor="#1DC624"
                            backgroundColor2="#F0F0F0"
                          />
                        ) : (
                          <Donut
                            value={((suspendedUser / totaluser) * 100).toFixed(
                              0
                            )}
                            backgroundColor="#1DC624"
                          />
                        )}
                        <small>
                          {((suspendedUser / totaluser) * 100).toFixed(0)}%
                        </small>
                      </div>
                      <h5 className="fs-18 text-black">Suspended User</h5>
                      <span>{suspendedUser}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Col xl={12} lg={6}>
          <Card>
            <Card.Header>
              <h4 className="card-title">Deposit 1 coin equal to 1.000</h4>
            </Card.Header>
            <Card.Body>
              <DualLineDeposit amountdata={totaldepositsdata} />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={12} lg={6}>
          <Card>
            <Card.Header>
              <h4 className="card-title">Withdrawal 1 coin equal to 1.000</h4>
            </Card.Header>
            <Card.Body>
              <DualLineWithdraw amountdata={totalwithdrawdata} />
            </Card.Body>
          </Card>
        </Col>
      </Fragment>
    );
  } else {
    return <WithSpinner />;
  }
};
export { orderdataBlog };

const mapStateToProps = createStructuredSelector({
  tokem: selectUserToken,
  totaluser: selectTotalUsers,
  balancedata: selectTotalBalance,
  activeusers: selectTotalActiveUsers,
  totaldepositsdata: selectTotalDepositsAmount,
  totalwithdrawdata: selectTotalWithdrawsAmount,
});
const mapDispatchToProps = (dispatch) => ({
  allUsers: (users) => dispatch(allUsers(users)),
  totalBalance: (totalbalancedata) => dispatch(totalBalance(totalbalancedata)),
  totalActiveUsers: (totalActiveUsersData) =>
    dispatch(totalActiveUsers(totalActiveUsersData)),
  totataldeposits: (depositsdata) => dispatch(totataldeposits(depositsdata)),
  setUserProfileData: (profile) => dispatch(setUserProfileData(profile)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
