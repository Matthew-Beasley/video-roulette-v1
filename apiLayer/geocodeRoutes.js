// const express = require("express");
// const geoRouter = express.Router();
// const Axios = require("axios");

// const url = "https://api.opencagedata.com/geocode/version/format?parameters";

// const lat = "34.052235";
// const long = "-118.243683";

// geoRouter.get("/", async (req, res, next) => {
//   const data = await Axios.get(
//     `${html}?key=${process.env.GEOCODING_API_KEY}&q=${lat},${long}&pretty=1&no_annotations=1`
//   );
//   res.send(data).data;
// });

// const response = (await Axios.get(
//   `https://api.opencagedata.com/geocode/version/format?parameters?key=${process.env.GEOCODING_API_KEY}&q=${position.latitude},${position.longitude}&pretty=1&no_annotations=1`
//   )).data
//   return response;
