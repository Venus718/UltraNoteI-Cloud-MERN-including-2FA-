/// Menu
import MetisMenu from "metismenujs";
import React, { Component, useContext, useEffect } from "react";
/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";
/// Link
import { Link } from "react-router-dom";
import useScrollPosition from "use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";
import profile from "../../../images/Untitled-1.jpg";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectProfileData } from "../../../redux/user/user.selectors";

class MM extends Component {
  componentDidMount() {
    this.$el = this.el;
    this.mm = new MetisMenu(this.$el);
  }
  componentWillUnmount() {
    //  this.mm("dispose");
    // console.log(this.mm);
  }
  render() {
    return (
      <div className="mm-wrapper">
        <ul className="metismenu" ref={(el) => (this.el = el)}>
          {this.props.children}
        </ul>
      </div>
    );
  }
}

const SideBar = ({ userProfileData }) => {
  const { iconHover, sidebarposition, headerposition, sidebarLayout } =
    useContext(ThemeContext);
  useEffect(() => {
    var btn = document.querySelector(".nav-control");
    var aaa = document.querySelector("#main-wrapper");
    function toggleFunc() {
      return aaa.classList.toggle("menu-toggle");
    }
    btn.addEventListener("click", toggleFunc);

    //sidebar icon Heart blast
    var handleheartBlast = document.querySelector(".heart");
    function heartBlast() {
      return handleheartBlast.classList.toggle("heart-blast");
    }

    handleheartBlast.addEventListener("click", heartBlast);
  }, []);
  let scrollPosition = useScrollPosition();
  /// Path
  let path = window.location.pathname;
  path = path.split("/")[1];
  /// Active menu
  let deshBoard = [
      "dashboard",
      "my-wallets",
      "transactions",
      "coin-details",
      "portofolio",
      "market-capital",
    ],
    app = ["users"],
    email = ["email-compose", "email-inbox", "email-read"],
    shop = [
      "ecom-product-grid",
      "ecom-product-list",
      "ecom-product-list",
      "ecom-product-order",
      "ecom-checkout",
      "ecom-invoice",
      "ecom-customers",
      "ecom-product-detail",
    ],
    charts = [
      "chart-rechart",
      "chart-flot",
      "chart-chartjs",
      "chart-chartist",
      "chart-sparkline",
      "chart-apexchart",
    ],
    profilepage = [
      "profile-details",
      // "chart-flot",
      // "chart-chartjs",
      // "chart-chartist",
      // "chart-sparkline",
      // "chart-apexchart",
    ],
    bootstrap = [
      "ui-accordion",
      "ui-badge",
      "ui-alert",
      "ui-button",
      "ui-modal",
      "ui-button-group",
      "ui-list-group",
      "ui-media-object",
      "ui-card",
      "ui-carousel",
      "ui-dropdown",
      "ui-popover",
      "ui-progressbar",
      "ui-tab",
      "ui-typography",
      "ui-pagination",
      "ui-grid",
    ],
    plugins = [
      "uc-select2",
      "uc-nestable",
      "uc-sweetalert",
      "uc-toastr",
      "uc-noui-slider",
      "map-jqvmap",
      "uc-lightgallery",
      "mass-email",
    ],
    widget = ["widget-basic"],
    forms = [
      "form-element",
      "form-wizard",
      "form-editor-summernote",
      "form-pickers",
      "form-validation-jquery",
    ],
    table = ["table-bootstrap-basic", "table-datatable-basic"],
    pages = [
      "page-register",
      "page-login",
      "page-lock-screen",
      "page-error-400",
      "page-error-403",
      "page-error-404",
      "page-error-500",
      "page-error-503",
    ],
    error = [
      "page-error-400",
      "page-error-403",
      "page-error-404",
      "page-error-500",
      "page-error-503",
    ];
  return (
    <div
      className={`deznav ${iconHover} ${
        sidebarposition.value === "fixed" &&
        sidebarLayout.value === "horizontal" &&
        headerposition.value === "static"
          ? scrollPosition > 120
            ? "fixed"
            : ""
          : ""
      }`}
    >
      <PerfectScrollbar className="deznav-scroll">
        <div className="main-profile">
          {userProfileData ? (
            <img src={userProfileData.userImage} alt="" />
          ) : (
            <img src={profile} alt="" />
          )}
          <Link to={"#"}>
            <i className="fa fa-cog" aria-hidden="true"></i>
          </Link>
          {userProfileData ? (
            <h5 className="mb-0 fs-20 text-black ">
              <span className="font-w400">Hello,</span>{" "}
              {userProfileData.firstname}
            </h5>
          ) : (
            <h5 className="mb-0 fs-20 text-black ">
              <span className="font-w400">Hello,</span> Steve
            </h5>
          )}
          {userProfileData ? (
            <p className="mb-0 fs-14 font-w400">{userProfileData.email}</p>
          ) : (
            <p className="mb-0 fs-14 font-w400">steve@email.com</p>
          )}
        </div>
        <MM className="metismenu" id="menu">
          <li className={`${deshBoard.includes(path) ? "mm-active" : ""}`}>
            <Link className="ai-icon" to="/dashboard">
              <i className="flaticon-144-layout"></i>
              <span className="nav-text">Dashboard</span>
            </Link>
            {/*<ul>
               <li><Link className={`${path === "wallet" ? "mm-active" : ""}`} to="/my-wallets">Wallet</Link></li>
              <li><Link className={`${path === "transactions" ? "mm-active" : ""}`} to="/transactions"> Transactions</Link></li>
			  <li><Link className={`${path === "coin-details" ? "mm-active" : ""}`} to="/coin-details"> Coin Details</Link> </li>
              <li><Link className={`${path === "portofolio" ? "mm-active" : ""}`} to="/portofolio">Portofolio</Link></li>
              <li><Link className={`${path === "market-capital" ? "mm-active" : ""}`} to="/market-capital">Market Capital</Link></li> 
            </ul>*/}
          </li>

          <li className={`${widget.includes(path) ? "mm-active" : ""}`}>
            <Link className="has-arrow ai-icon" to="#">
              <i className="flaticon-044-file"></i>
              <span className="nav-text">Fainancial Reports</span>
            </Link>
            <ul>
              <li>
                <Link
                  className={`${path === "app-profile" ? "mm-active" : ""}`}
                  to="/app-profile"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  className={`${path === "post-details" ? "mm-active" : ""}`}
                  to="/post-details"
                >
                  Post Details
                </Link>
              </li>
              <li className={`${email.includes(path) ? "mm-active" : ""}`}>
                <Link className="has-arrow" to="#">
                  Email
                </Link>
                <ul className={`${email.includes(path) ? "mm-show" : ""}`}>
                  <li>
                    <Link
                      className={`${
                        path === "email-compose" ? "mm-active" : ""
                      }`}
                      to="/email-compose"
                    >
                      Compose
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`${path === "email-inbox" ? "mm-active" : ""}`}
                      to="/email-inbox"
                    >
                      Inbox
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`${path === "email-read" ? "mm-active" : ""}`}
                      to="/email-read"
                    >
                      Read
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link
                  className={`${path === "app-calender" ? "mm-active" : ""}`}
                  to="/app-calender"
                >
                  Calendar
                </Link>
              </li>
              <li className={`${shop.includes(path) ? "mm-active" : ""}`}>
                <Link className="has-arrow" to="#">
                  Shop
                </Link>
                <ul className={`${shop.includes(path) ? "mm-show" : ""}`}>
                  <li>
                    <Link
                      className={`${
                        path === "ecom-product-grid" ? "mm-active" : ""
                      }`}
                      to="/ecom-product-grid"
                    >
                      Product Grid
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`${
                        path === "ecom-product-list" ? "mm-active" : ""
                      }`}
                      to="/ecom-product-list"
                    >
                      Product List
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`${
                        path === "ecom-product-detail" ? "mm-active" : ""
                      }`}
                      to="/ecom-product-detail"
                    >
                      Product Details
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`${
                        path === "ecom-product-order" ? "mm-active" : ""
                      }`}
                      to="/ecom-product-order"
                    >
                      Order
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`${
                        path === "ecom-checkout" ? "mm-active" : ""
                      }`}
                      to="/ecom-checkout"
                    >
                      Checkout
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`${
                        path === "ecom-invoice" ? "mm-active" : ""
                      }`}
                      to="/ecom-invoice"
                    >
                      Invoice
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`${
                        path === "ecom-customers" ? "mm-active" : ""
                      }`}
                      to="/ecom-customers"
                    >
                      Customers
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li className={`${charts.includes(path) ? "mm-active" : ""}`}>
            <Link className="has-arrow ai-icon" to="#">
              <i className="flaticon-008-credit-card"></i>
              <span className="nav-text">Wallets</span>
            </Link>
            {/* <ul >
              <li>
                <Link
                  className={`${path === "chart-rechart" ? "mm-active" : ""}`}
                  to="/chart-rechart"
                >
                  RechartJs
                </Link>
              </li>
              <li>
                <Link
                  className={`${path === "chart-chartjs" ? "mm-active" : ""}`}
                  to="/chart-chartjs"
                >
                  Chartjs
                </Link>
              </li>
              <li>
                <Link
                  className={`${path === "chart-chartist" ? "mm-active" : ""}`}
                  to="/chart-chartist"
                >
                  Chartist
                </Link>
              </li>
              <li>
                <Link
                  className={`${path === "chart-sparkline" ? "mm-active" : ""}`}
                  to="/chart-sparkline"
                >
                  Sparkline
                </Link>
              </li>
              <li>
                <Link
                  className={`${path === "chart-apexchart" ? "mm-active" : ""}`}
                  to="/chart-apexchart"
                >
                  Apexchart
                </Link>
              </li>
            </ul> */}
          </li>
          <li className={`${profilepage.includes(path) ? "mm-active" : ""}`}>
            <Link className="has-arrow ai-icon" to="#">
              <i className="flaticon-028-user-1"></i>
              <span className="nav-text">Profile</span>
            </Link>
            <ul>
              <li>
                <Link
                  className={`${path === "profile-details" ? "mm-active" : ""}`}
                  to="/profile-details"
                >
                  Edit Profile
                </Link>
              </li>
            </ul>
          </li>
          <li className={`${app.includes(path) ? "mm-active" : ""}`}>
            <Link className="ai-icon" to="/users">
              <i className="flaticon-019-add-user"></i>
              <span className="nav-text">User Management</span>
            </Link>
          </li>
          <li className={`${pages.includes(path) ? "mm-active" : ""}`}>
            <Link className="has-arrow ai-icon" to="#">
              <i className="flaticon-073-settings"></i>
              <span className="nav-text">Settings</span>
            </Link>
          </li>
          <li className={`${plugins.includes(path) ? "mm-active" : ""}`}>
            <Link className="ai-icon" to="/mass-email">
              <i className="flaticon-076-email-1"></i>
              <span className="nav-text">Mass email</span>
            </Link>
          </li>
        </MM>
        <div className="copyright">
          <p>
            <strong>UltraNote</strong> © 2021 All Rights Reserved
          </p>
          <p className="fs-12">
            Made with <span className="heart"></span> by UltraNote
          </p>
        </div>
      </PerfectScrollbar>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  userProfileData: selectProfileData,
});

export default connect(mapStateToProps)(SideBar);
