import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const res = await axios(
      {
        method: 'PATCH',
        url: `/api/v1/users/${type === 'password' ? 'updateMyPassword' : 'updateMe'}`,
        data,
        withCredentials: true,
      },
      { crossdomain: true },
    );
    if (res.data.status === 'success') {
      showAlert(
        'success',
        `${type.at(0).toUpperCase() + type.slice(1)} updated successfully!`,
      );
    }
  } catch (error) {
    showAlert('error', error.response?.data.message || error.message); // Added error fallback
  }
};
