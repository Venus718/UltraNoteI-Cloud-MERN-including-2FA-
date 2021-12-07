import React, { Fragment, useState, useRef, useEffect } from "react";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { connect } from "react-redux";
import {
  selectProfileData,
  selectUserToken,
} from "../../../redux/user/user.selectors";
import { createStructuredSelector } from "reselect";
import "../AppsMenu/AppProfile/AppProfile.css";
import PageTitle from "../../layouts/PageTitle";
import moment from "moment";
import BootstrapSwitchButton from "bootstrap-switch-button-react";

const UserEdit = (props) => {
  const { id } = props.match.params;
  const { token } = props;
  console.log(token);

  const getBase64 = (file, cb) => {
    const reader = new FileReader();
    if (file.size > 2050000) {
      return;
    } else {
      reader.onloadend = () => {
        setUserData({
          ...userData,
          avatar: reader.result,
        });
        cb(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const updateUser = async () => {
    let formData = {
      _id: userData._id,
      firstname: userData.firstName,
      lastname: userData.lastName,
      mail: userData.mail,
      phone: userData.phone,
      currency: userData.currency,
      isActive: userData.isActive,
      two_factor_auth: userData.two_fact_auth,
      ...(userData.avatar && { avatar: userData.avatar }),
    };
    await axios
      .post("https://portal.ultranote.org/api/admin/updateprofile", formData, {
        headers: {
          Authorization: token.token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
      });
  };
  useEffect(() => {
    axios
      .post("https://portal.ultranote.org/api/users/user_profile", {
        userId: id,
      })
      .then((res) => {
        setUserData(res.data.user);
        axios
          .post("https://portal.ultranote.org/api/wallets/wallet_list")
          .then((resp) => {
            const { wallets } = resp.data;
            const wallet = wallets.filter(
              (wallet) => wallet.walletHolder == res.data.user._id
            );
            setWalletData(wallet[0]);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const [userData, setUserData] = useState({});
  const [walletList, setWalletList] = useState([]);
  const [walletData, setWalletData] = useState([]);
  const handleBack = () => {
    props.history.goBack();
  };
  const toggleEdit = () => {
    setEdit(!edit);
  };
  const [edit, setEdit] = useState(false);
  const handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      setUserData({
        ...userData,
        avatar: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Fragment>
      <PageTitle activeMenu="User Profile" motherMenu="App" />
      <div className="row">
        <div className="col-sm-12 col-md-12">
          <div className="card">
            <div className="card-header">
              <Button onClick={handleBack} variant="link">
                <i className="la la-arrow-left"></i>
              </Button>
              <div>
                <h4 className="card-title text-right">
                  User balance:{" "}
                  <span className="text-success">
                    {walletData?.balance || "0"}
                  </span>{" "}
                  XUNI
                </h4>
                <p>
                  <small> {walletData.address} </small>
                </p>
              </div>
            </div>

            <div className="card-body">
              <Fragment>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="First Name"
                        value={userData.firstName}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Last Name"
                        value={userData.lastName}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={userData.mail}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            mail: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Phone"
                        value={userData.phone}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        className="form-control"
                        value={userData.status}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            isActive: e.target.value === "true" ? true : false,
                          })
                        }
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Suspended</label>
                      <select
                        className="form-control"
                        value={userData.suspended}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            suspended: e.target.value === "true" ? true : false,
                          })
                        }
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Currency</label>
                      <select
                        className="form-control"
                        value={userData.currency}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            currency: e.target.value,
                          })
                        }
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>2FA Enabled</label>
                      <div
                        className="d-flex switch"
                        style={{
                          marginTop: "-50px",
                          marginBottom: "60px",
                        }}
                      >
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              two_fact_auth: e.target.checked,
                            })
                          }
                          checked={userData.two_fact_auth}
                          value={userData.two_fact_auth}
                          className="switch-input"
                          style={{
                            margintop: "-50px",
                          }}
                        />
                        <span className="slider round"></span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Avatar</label>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Upload</span>
                        </div>
                        <div className="custom-file">
                          <input
                            type="file"
                            onChange={handleImageChange}
                            accept=".jpeg,.jpg,.png,.svg"
                            className="custom-file-input"
                          />
                          <label className="custom-file-label">
                            Choose file
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            </div>
            <div className="card-footer text-right">
              <Button
                onClick={() => {
                  updateUser();
                }}
                variant="primary"
                className="mr-2"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UserEdit;
