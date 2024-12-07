const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin/admin_model');

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
    req.admin = decoded.admin;

    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) 
    {
      return res.status(401).json({ msg: 'Admin not found' });
    }

    req.admin.username = admin.username;
    next();
  } 
  catch (err) 
  {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
