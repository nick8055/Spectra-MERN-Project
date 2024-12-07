const jwt = require('jsonwebtoken');
const Student = require('../models/Student/student_model');

module.exports = async (req, res, next) => 
{
  const token = req.header('x-auth-token');

  if (!token) 
  {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try 
  {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.student = decoded.student;

    const student = await Student.findById(req.student.id).select('-password');
    if (!student) 
    {
      return res.status(401).json({ msg: 'Student not found' });
    }

    req.student.universityRegId = student.universityRegId;
    next();
  } 
  catch (err) 
  {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
