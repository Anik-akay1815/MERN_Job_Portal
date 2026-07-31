const express = require('express');
const companyRouter = express.Router();

const companycontroller=require('../controllers/companycontroller');
companyRouter.post('/register',companycontroller.register);
companyRouter.post('/login',companycontroller.login);

companyRouter.get('/all',companycontroller.getallCompany);

companyRouter.get('/:id',companycontroller.getbyID);
companyRouter.put('/:id',companycontroller.updateCompany);
companyRouter.delete('/:id',companycontroller.deleteCompany);

module.exports = companyRouter;