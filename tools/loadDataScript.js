const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');

const allTours = fs.readFileSync(
  `${__dirname}/../dev-data/data/tours-simple.json`,
  'utf-8',
);
const updateTours = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/tours', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(allTours),
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch. Status: ${response.status} - ${response.statusText}`,
      );
    }
    const data = await response.json();
    // console.log('Tours:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const getAllTours = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/tours');
    if (!response.ok) {
      throw new Error(
        `Failed to fetch. Status: ${response.status} - ${response.statusText}`,
      );
    }
    const data = await response.json();
    return data.data.tours;
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const deleteAllTours = async () => {
  const tours = await getAllTours();
  tours.forEach(async (e) => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/v1/tours/' + e._id,
        {
          method: 'DELETE',
        },
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch. Status: ${response.status} - ${response.statusText}`,
        );
      }
      const data = await response.json();
      // console.log('Tours:', data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  });
};

deleteAllTours();
