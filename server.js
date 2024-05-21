const app = require("./index");
const PORT = process.env.PORT || 9001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

