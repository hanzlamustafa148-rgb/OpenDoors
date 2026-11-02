//location text ko latitude/longitude me badalta hai (Nominatim, OpenStreetMap ki free service)
module.exports = async (location, country) => {
  const query = encodeURIComponent(`${location}, ${country}`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

  const response = await fetch(url, {
    headers: { "User-Agent": "OpenDoorsApp/1.0 (college project)" },
  });
  const data = await response.json();

  if (!data.length) return null; //jagah nahi mili

  return {
    type: "Point",
    coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)],
  };
};