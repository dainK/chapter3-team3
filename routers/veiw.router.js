import { Router } from "express";

const viewRouter = Router();
/* GET home page. */
viewRouter.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

export { viewRouter };