const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require("body-parser");
dotenv.config();

app.use(bodyParser.json());
app.use
(
  cors
  ({
    origin: [process.env.ADMIN_APP_URL, process.env.STUDENT_APP_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.static('images'));

mongoose.connect(process.env.DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to Backend Database'))
  .catch(err => console.log(err));


//Routes used in Admin Client App  
app.use('/api/admins', require('./routes/Admin/admin_routes'));
app.use('/api/internships', require('./routes/Admin/intern_routes'))
app.use('/api/jobs', require('./routes/Admin/job_routes'))
app.use('/api/hackathons', require('./routes/Admin/hack_routes'))
app.use('/api/spreadSheet', require('./routes/Admin/spreadsheet_route'))

//Routes used in Student Client App
app.use('/api/students', require('./routes/Student/student_routes'));
app.use('/api/count', require('./routes/Student/count_batchFilter'))


app.listen(process.env.PORT, () => {console.log(`Server is running on port ${process.env.PORT}`);});
