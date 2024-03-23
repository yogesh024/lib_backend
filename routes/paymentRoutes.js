require("dotenv").config();
const payment_route = express();
const path=require("path");
const bodyParser = require('body-parser');

payment_route.use(bodyParser.json());
payment_route.use(bodyParser.urlencoded({ extended:false }));

const paymentController=require('../controllers/paymentController')

payment_route.get('/',paymentController.renderBuyPage)
payment_route.post('/payment', paymentController.payment);

payment_route.get('/success',paymentController.success);
payment_route.get('/faliure',paymentController.failure);

module.exports =payment_route;