export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZGV2emFxIiwiYSI6ImNtOGUwd2x2cTJmaWwycnM4NG8wNDF5dmsifQ.hIsuLN8nYbvOXUreUsCXWQ';

  const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [-118.25814, 34.041241], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9, // starting zoom
    style: 'mapbox://styles/mapbox/light-v11',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //add popup
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(
        `<p>
    Day ${loc.day}: ${loc.description}
  </p>`,
      )
      .addTo(map);

    //extend map bounds to include current locations
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
