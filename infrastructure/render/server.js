const express = require("express");
const app = express();

app.get("/heartbeath", (req, res) => {
  res.status(200).json( {
    status: "live"
   ,  aurora: true,
      owner: "WM"
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`GD-AURORA booted sur http://0.0.0.0:*{port}`);
});