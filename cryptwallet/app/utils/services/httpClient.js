import axios from "axios";

export const clientHttp = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}`,
  timeout: 60000,
});

clientHttp.interceptors.request.use(
  (config) => {
    if (
      localStorage.getItem("user") &&
      localStorage.getItem("token")
    ) {
      const token = localStorage.getItem("token");
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// clientHttp.interceptors.response.use(
//   (response) => {
//     store.dispatch({
//       type: SpinnerTypes.HIDE_SPINNER,
//     });
//     const error = store.getState().error;
//     // check if there is any error in valid response
//     if (error && error.code) {
//       store.dispatch({
//         type: AlertActionTypes.REMOVE_ERROR,
//       });
//     }

//     return response;
//   },
//   (error) => {
//     if (error && error.response && error.response.data.code) {
//       console.log(error.response);
//       const payload = {
//         code: error.response.data.code,
//         status: error.response.status,
//       };
//       store.dispatch({
//         type: AlertActionTypes.ADD_ERROR,
//         payload,
//       });
//     }
//     else {
//       const message = store.getState()?.language?.translation?.UNKNOWN_ERROR;
//       store.dispatch({
//         type: AlertActionTypes.ADD_CUSTOM_ERROR,
//         payload: message,
//       });
//     }
//     store.dispatch({
//       type: SpinnerTypes.HIDE_SPINNER,
//     });
//   }
// );