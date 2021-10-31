import React, { Component } from "react";
import { Bar } from "react-chartjs-2";


class BarChart1 extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!

  }
  // componentDidMount() {
  //   axios.post(`http://localhost:5000/api/users/user_list`)
  //   .then(res => {
  //     const persons = res.data;
  //     console.log(persons);
  //     allUsers(persons);
  //     }).catch(function (error) {
  //     // handle error
  //     console.log(error);
  //     });
  // }
  render() {
    console.log(this.props);
    console.log(this.props.users);
    const { users } = this.props;
      const data = {
      defaultFontFamily: "Poppins",
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug","Sep","Oct","Nov","Dec"],
      datasets: [
        {
          label: "User Registred With Months",
          
          data: [users/12, users/11, users/10, users/9, users/8, users/7, users/6,users/5,users/4,users/3,users/2,users/1],
          
          borderColor: "rgba(64, 24, 157, 1)",
          borderWidth: "0",
          backgroundColor: "#EB8153",
        },
      ],
    };
  
    const options = {
      legend: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
            // Change here
            barPercentage: 0.5,
          },
        ],
      },
    };
  
  
    return (
      <>
        <Bar data={data} height={150} options={options} />
      </>
    );
  }
}


export default BarChart1;
