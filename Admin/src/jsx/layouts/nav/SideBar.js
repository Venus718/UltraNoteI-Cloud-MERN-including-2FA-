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
  path = path.split("/");
  path = path[path.length - 1];
  /// Active menu
  let deshBoard = [
      "",
      "my-wallets",
      "transactions",
      "coin-details",
      "portofolio",
      "market-capital",
    ],
    app = ["users"],
    profilepage = ["profile-details"];
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
            <Link className="has-arrow ai-icon" to="#">
              <i className="flaticon-144-layout"></i>
              <span className="nav-text">Dashboard</span>
            </Link>
            <ul>
              <li>
                <Link
                  className={`${path === "" ? "mm-active" : ""}`}
                  to="/dashboard"
                >
                  {" "}
                  Dashboard{" "}
                </Link>
              </li>
            </ul>
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
            <Link className="has-arrow ai-icon" to="#">
              <i className="flaticon-019-add-user"></i>
              <span className="nav-text">User Management</span>
            </Link>
            <ul>
              <li>
                <Link
                  className={`${path === "users" ? "mm-active" : ""}`}
                  to="/users"
                >
                  User List
                </Link>
              </li>
            </ul>
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
