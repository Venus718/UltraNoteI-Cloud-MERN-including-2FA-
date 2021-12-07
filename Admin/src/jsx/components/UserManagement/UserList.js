import React, { Fragment, Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { selectUserToken } from "../../../redux/user/user.selectors";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.tokem.token,
      data: [],
      sort: 8,
      activePag: 0,
      test: 0,
      allUsers: [],
      activeUsers: [],
      inactiveUsers: [],
      suspendedUsers: [],
      totalUsers: 0,
    };
    this.paggination = Array(
      Math.ceil(this.state.data.length / this.state.sort)
    );
  }
  componentDidMount() {
    axios
      .get(`https://portal.ultranote.org/api/users/user_list`, {
        headers: {
          Authorization: this.state.token,
        },
      })
      .then((res) => {
        this.setState({
          allUsers: res.data,
          data: res.data,
          activeUsers: res.data.users.filter((user) => user.isActive == true),
          inactiveUsers: res.data.users.filter(
            (user) => user.isActive == false
          ),
          suspendedUsers: res.data.users.filter(
            (user) => user.suspended == true
          ),
          totalUsers: res.data.users.length,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  chageData = (frist, sec) => {
    for (var i = 0; i < this.state.data.length; ++i) {
      if (i >= frist && i < sec) {
        this.state.data[i].classList.remove("d-none");
      } else {
        this.state.data[i].classList.add("d-none");
      }
    }
  };

  onClick = (i) => {
    this.state.activePag.current = i;
    this.chageData(
      this.state.activePag.current * this.state.sort,
      (this.state.activePag.current + 1) * this.state.sort
    );
  };

  searchHandler = (e) => {
    const search = e.target.value;
    if (search == "") {
      this.setState({
        data: this.state.allUsers,
      });
      return;
    }
    const searchUsers = this.state.data.users.filter((user) => {
      return user.mail?.toLowerCase().includes(search.toLowerCase());
    });
    this.setState({
      data: {
        users: searchUsers,
      },
    });
  };

  render() {
    const { data, totalUsers } = this.state;
    return (
      <Fragment>
        <div className="form-head d-flex align-items-center flex-wrap mb-3">
          <h2 className="font-w600 mb-0 text-black">Users List</h2>
          <div className="d-flex align-items-center ml-auto">
            <input
              type="text"
              className="form-control"
              placeholder="Enter email"
              onChange={this.searchHandler}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="table-responsive table-hover fs-14">
              <div
                id="example5_wrapper"
                className="dataTables_wrapper no-footer"
              >
                {totalUsers > 0 && (
                  <BootstrapTable
                    data={data.users}
                    keyField="_id"
                    wrapperClasses="table-responsive m-0"
                    classes="mb-4 dataTablesCard short-one card-table text-black dataTable no-footer "
                    pagination={paginationFactory({
                      sizePerPage: this.state.sort,
                      hideSizePerPage: true,
                      hidePageListOnlyOnePage: true,
                      alwaysShowAllBtns: true,
                      withFirstAndLast: false,
                      firstPageText: "First",
                      prePageText: "Prev",
                      nextPageText: "Next",
                      lastPageText: "Last",
                      nextPageTitle: "First page",
                      prePageTitle: "Pre page",
                      firstPageTitle: "Next page",
                      lastPageTitle: "Last page",
                      showTotal: true,
                      paginationTotalRenderer: (from, to, size) => (
                        <span className="pagination-total">
                          Showing {from} to {to} of {size} results
                        </span>
                      ),
                    })}
                    columns={[
                      {
                        dataField: "rowIndex",
                        text: "ID",
                        formatter: (cell, row, rowIndex) => {
                          return <span>{rowIndex + 1}</span>;
                        },
                      },
                      {
                        dataField: "mail",
                        text: "Email",
                      },
                      {
                        dataField: "isActive",
                        text: "Status",
                        formatter: (cell, row) => {
                          if (
                            row.isActive === true &&
                            row.suspended === false
                          ) {
                            return (
                              <span className="badge badge-success">
                                Active
                              </span>
                            );
                          } else {
                            return (
                              <span className="badge badge-danger">
                                Inactive
                              </span>
                            );
                          }
                        },
                      },
                      {
                        dataField: "options",
                        text: "Options",
                        formatter: (cell, row) => {
                          return (
                            <div className="d-flex align-items-center">
                              <Link
                                to={`/users/${row._id}`}
                                className="btn btn-sm btn-secondary mr-1"
                              >
                                <i className="la la-edit"></i>
                              </Link>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => this.props.onDelete(row._id)}
                              >
                                <i className="la la-trash"></i>
                              </button>
                            </div>
                          );
                        },
                      },
                    ]}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  tokem: selectUserToken,
});

export default connect(mapStateToProps)(UserList);
