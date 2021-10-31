import React,{Fragment,Component,useState,useEffect ,useContext} from 'react';
import {Link} from 'react-router-dom';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import { Dropdown } from "react-bootstrap";
import { connect } from 'react-redux';
import Donut from "../zenix/MyWallets/Donut";
import axios from 'axios';
import { createStructuredSelector } from 'reselect';
//http://localhost:5000/api/users/activeUsers -- active user
//Images
// https://cloud.ultranote.org/api/wallets/transactions/XuniihE4LneQDtUjFTiPGufSxpfQ52u2uSibdiVqv3WkFMuo5yQRhz2NHeJAzrh8Ar2UqhYpiWAvNgZzqdydmeyAZL4TJQh15Ab
import Card1 from './../../../images/card/card1.jpg';
import { Row, Col, Card } from "react-bootstrap";
import BarChart1 from "../charts/Chartjs/bar1";
import { ThemeContext } from "../../../context/ThemeContext";
import { allUsers } from '../../../redux/home/home.actions';
import { selectUserToken } from '../../../redux/user/user.selectors';
import { selectTotalUsers } from '../../../redux/home/home.selectors';
import { totalBalance } from '../../../redux/home/home.actions';
import { selectTotalBalance } from '../../../redux/home/home.selectors';
import { totalActiveUsers } from '../../../redux/home/home.actions';
import { selectTotalActiveUsers  } from '../../../redux/home/home.selectors';
import WithSpinner from '../spinner/spinner';
import { totataldeposits } from '../../../redux/home/home.actions';
import {selectTotalDepositsAmount} from '../../../redux/home/home.selectors';
import { selectTotalWithdrawsAmount } from '../../../redux/home/home.selectors';
import DualLineWithdraw from '../../components/charts/Chartjs/dualLinewithdraw';
import  DualLineDeposit  from '../../components/charts/Chartjs/dualLine';
import PageTitle from '../../layouts/PageTitle';
import {setUserProfileData} from '../../../redux/user/user.actions'; 
const MarketOverviewChart = loadable(() =>
	pMinDelay(import("../zenix/Home/MarketOverviewChart"), 1000)
);
const CurrentChart = loadable(() =>
	pMinDelay(import("../zenix/Home/CurrentChart"), 1000)
);



const orderdataBlog = [
	{price: '82.1', amount: '58.9', total: '134.10',},
	{price: '85.2', amount: '55.8', total: '136,12',},
	{price: '87.3', amount: '53.7', total: '138,12',},
	{price: '89.4', amount: '51.6', total: '139,12',},
	{price: '91.9', amount: '47.1', total: '140,12',},
	{price: '93.8', amount: '46.2', total: '142,12',},
	{price: '94.7', amount: '45.3', total: '145,12',},
	{price: '97.6', amount: '44.4', total: '147,12',},
];


const Home = ({tokem,allUsers,totaluser,balancedata ,totalBalance , totalActiveUsers ,activeusers , totataldeposits , totalwithdrawdata ,totaldepositsdata , setUserProfileData}) => {
 console.log(totaluser,balancedata,activeusers);
 console.log(totaldepositsdata,totalwithdrawdata);	
 const [suspendedUser, setSuspendedUser] = useState();
   // Similar to componentDidMount and componentDidUpdate:
   useEffect(() => {
	console.log('mounted');
	 
    // Update the document title using the browser API
	axios.get(`https://cloud.ultranote.org/api/users/user_list`,{
		headers: {
		  'Authorization': tokem.token
		}
	  })
	.then(res => {
	  const persons = res.data;
	  console.log(persons);
	  allUsers(persons);
	  }).catch(function (error) {
		// handle error
	  console.log(error);
	  });
	    axios.get(`https://cloud.ultranote.org/api/users/activeUsers`,{
		headers: {
		'Authorization': tokem.token
		}
		})
		.then(res => {
		const activeusers = res.data;
		console.log(activeusers);
		totalActiveUsers(activeusers);
		}).catch(function (error) {
		// handle error
		console.log(error);
		}); 
		axios.get(`https://cloud.ultranote.org/api/wallets/transactions/Xuniig11qtQ5qTbcG2aoP4Vo59nk9FXQ2RrJg6K9F32eYwcQ7Grxc8zfZAgG9EdVqY4r8eVXRB6qh7onf58CCDVhbgAmAz747ux`,{
		headers: {
		'Authorization': tokem.token
		}
		})
		.then(res => {
		const depositsdata = res.data;
		console.log('Deposit DATA =>',depositsdata);
		totataldeposits(depositsdata);
		}).catch(function (error) {
		// handle error
		console.log(error);
		}); 
		axios.get(`https://cloud.ultranote.org/api/admin/profiledetails`, {
		headers: {
		'Authorization': tokem.token
		}
		})
		.then(res => {
		const userprofiledata = res.data;
		console.log('User Profile DATA =>',userprofiledata.products[0]);
		setUserProfileData(userprofiledata.products[0]);
		}).catch(function (error) {
		// handle error
		console.log(error);
		});   
		axios.post(`https://cloud.ultranote.org/api/users/suspended_user`,{"hhj":"kol"}, {
			headers: {
			'Authorization': tokem.token
			}
			})
			.then(res => {
			const suspended_user = res.data.users.length;
			console.log('suspended_user',suspended_user);
			setSuspendedUser(suspended_user);
			}).catch(function (error) {
			// handle error
			console.log(error);
			});       



	  return () => console.log('unmounting...');    
  },[]);

  
  

	const { background } = useContext(ThemeContext);
	const [crrency1, setCrrency1] = useState("Monthly (2021)");
	const [crrency2, setCrrency2] = useState("Monthly (2021)");
	const [crrency3, setCrrency3] = useState("Monthly (2021)");
	const [crrency4, setCrrency4] = useState("Monthly (2021)");

	const [country1, setCountry1] = useState("Medan, IDN");
	const [country2, setCountry2] = useState("Jakarta, IDN");
	const [country3, setCountry3] = useState("Surabaya, IDN");
    

 
 //   console.log(activeusers);
 if (totaluser  && activeusers && totaldepositsdata) {  
return (
	
		<Fragment>
      <PageTitle activeMenu="Dashboard" motherMenu="App" />
	
			<div className="col-xl-6 col-xxl-12">
					<div className="row">
						
							<div className="col-sm-6" >
								<div className="card-bx stacked card">
									<img src={Card1} alt="" />
									<div className="card-info">
										<p className="mb-1 text-white fs-14">Total User </p>
										<div className="d-flex justify-content-between">
											<h2 className="num-text text-white mb-5 font-w600">{totaluser}</h2>
								            
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="36" height="36" viewBox="0 0 32.000000 32.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,32.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M92 294 c-99 -50 -109 -202 -19 -268 32 -23 26 -26 73 39 14 19 14
19 28 0 47 -65 41 -62 73 -39 82 60 83 197 0 256 -39 28 -112 34 -155 12z
m105 -23 c-3 -12 4 -27 17 -39 11 -10 26 -27 31 -37 6 -10 16 -16 23 -14 16 6
-17 71 -40 77 -10 2 -18 8 -18 13 0 18 19 8 49 -26 27 -31 31 -43 31 -90 0
-48 -4 -60 -33 -91 l-33 -36 -26 38 -27 37 20 28 c11 16 26 26 33 23 8 -3 17
-1 21 5 13 22 -47 11 -66 -11 l-20 -23 -15 23 c-16 22 -83 34 -69 12 3 -5 14
-10 24 -10 10 0 26 -11 34 -24 15 -22 14 -26 -10 -60 -24 -37 -25 -37 -45 -19
-95 86 -40 243 86 243 33 0 38 -3 33 -19z"/>
<path d="M83 244 c-26 -23 -34 -37 -29 -50 6 -15 11 -12 37 19 23 28 38 37 61
37 19 0 28 4 26 13 -9 24 -58 14 -95 -19z"/>
</g>
</svg>

							   
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
														value={66}
														backgroundColor="#FF6826"
														backgroundColor2="#F0F0F0"
													  />
													) : (
													  <Donut value={45} backgroundColor="#FF6826" />
													)}
													<small>45%</small>
												</div>
												<h5 className="fs-18 text-black">Active Users</h5>
												<span>{activeusers}</span>
											</div>
											<div className="col-sm-6 mb-sm-0 mb-4 text-center">
												<div className="d-inline-block position-relative donut-chart-sale mb-3">
													{background.value === "dark" ? (
													  <Donut
														value={31}
														backgroundColor="#1DC624"
														backgroundColor2="#F0F0F0"
													  />
													) : (
													  <Donut value={31} backgroundColor="#1DC624" />
													)}
													<small>31%</small>
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
		<h4 className="card-title">Withdrawal  1 coin equal to 1.000</h4>
		</Card.Header>
		<Card.Body>
		<DualLineWithdraw amountdata={totalwithdrawdata}/>
		</Card.Body>
		</Card>
		</Col>
		</Fragment>
	
	
);  
} else { 
return (
<WithSpinner />

);
}

  

}
export {orderdataBlog};



const mapStateToProps = createStructuredSelector({
tokem: selectUserToken,
totaluser: selectTotalUsers,
balancedata:selectTotalBalance,
activeusers:selectTotalActiveUsers, 
totaldepositsdata:selectTotalDepositsAmount,
totalwithdrawdata:selectTotalWithdrawsAmount
});
const  mapDispatchToProps = dispatch => ({
allUsers: users => dispatch(allUsers(users)),
totalBalance: totalbalancedata => dispatch(totalBalance(totalbalancedata)),
totalActiveUsers: totalActiveUsersData => dispatch(totalActiveUsers(totalActiveUsersData)),
totataldeposits: depositsdata => dispatch(totataldeposits(depositsdata)),
setUserProfileData:profile  => dispatch(setUserProfileData(profile))
});

export default connect(mapStateToProps,mapDispatchToProps)(Home);