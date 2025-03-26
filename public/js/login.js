import axios from 'axios';
import { showAlert } from './alerts';
export const login = async (email, password) => {
  try {
    const res = await axios(
      {
        method: 'POST',
        url: 'http://127.0.0.1:3000/api/v1/users/login',
        data: { email, password },
        withCredentials: true,
      },
      { crossdomain: true },
    );
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (error) {
    showAlert('error', error.response?.data.message || error.message); // Added error fallback
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });

    if (res.data.status === 'success') location.reload(true);
  } catch (error) {
    showAlert('error', 'Error Logging out! Try again.');
  }
};
