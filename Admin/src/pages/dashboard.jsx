import React from 'react';
import Nav from "../jsx/layouts/nav";
import Footer from "../jsx/layouts/Footer";
import Home from '../jsx/components/Dashboard/Home';
const DashboardPage = () => (
<div id="main-wrapper"  className="show mh100vh ">
<Nav/>
<div className="content-body">
<div className="container-fluid" style={{ minHeight: window.screen.height - 60 }} >
<Home/>
</div>
</div>
<Footer />
</div>     
);

export default DashboardPage;