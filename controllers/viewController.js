const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const userModel = require('../models/userModel');
const Booking = require('../models/bookingModel');

exports.getOverview = catchAsync(async (req, res) => {
  //get tour data from collection
  const tours = await Tour.find();
  //build the template

  //render that template using tour data from 1

  res
    .status(200)
    .setHeader(
      'Content-Security-Policy',
      "script-src 'self' https://js.stripe.com; worker-src 'self' blob:;",
    )
    .render('overview', {
      title: 'All tours',
      tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name!', 404));
  }

  res
    .status(200)
    .setHeader(
      'Content-Security-Policy',
      "script-src 'self' https://api.mapbox.com https://js.stripe.com; worker-src 'self' blob:;",
    )
    .render('tour', {
      title: tour.name + ' Tour',
      tour,
    });
});

exports.getLoginForm = catchAsync(async (req, res) => {
  res
    .status(200)
    .setHeader(
      'Content-Security-Policy',
      "script-src 'self' https://cdnjs.cloudflare.com  https://js.stripe.com  ; worker-src 'self' blob:;",
    )
    .render('login', {
      title: 'Log into your accound',
    });
});

exports.getUserInfo = catchAsync(async (req, res) => {
  res
    .status(200)
    .setHeader(
      'Content-Security-Policy',
      "script-src 'self' https://cdnjs.cloudflare.com  https://js.stripe.com ; worker-src 'self' blob:;",
    )
    .render('account', {
      title: 'My account',
    });
});

exports.updateUserData = catchAsync(async (req, res) => {
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { runValidators: true, new: true },
  );
  res.status(200).render('account', {
    title: 'My account',
    user: updatedUser,
  });
});

exports.getMyTours = catchAsync(async (req, res) => {
  // 1) FIND ALL BOOKINGS
  const bookings = await Booking.find({ user: req.user.id });

  // 2) FIND TOURS WITH THE RETURNED ID
  const tourIds = bookings.map((e) => e.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res
    .status(200)
    .setHeader(
      'Content-Security-Policy',
      "script-src 'self' https://js.stripe.com; worker-src 'self' blob:;",
    )
    .render('overview', {
      title: 'My tours',
      tours,
    });
});
