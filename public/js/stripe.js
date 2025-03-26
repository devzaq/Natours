import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51R6DglBbphT2o3hlEbU8w4po88MoQmMOOpem9dhDIGD6uqP1AfJEzq0ENkjhF5iIMMQmV6o10hnbzwXDvKR6BMe000zFt2INIP',
);

export const bookTour = async (tourId) => {
  try {
    //1) GET CHECKOUT SESSION WITH API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    //2) CREATE CHECKOUT FORM AND CHARGE CREDIT CARD
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    // console.log(error);
    showAlert('error', 'Something went wrong');
  }
};
