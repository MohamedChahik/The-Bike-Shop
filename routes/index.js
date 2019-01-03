var express = require('express');
var router = express.Router();

// Here I can store my Stripe public and private keys in an object in order to re-use them when I want... Thanks to JavaScript... It is not necessary but could be usefull I case the application would get bigger and grow.
var myOwnKeys = {
  public: "pk_test_fbtCwV2OyBVQNLvkvrQgnruO",
  private: "sk_test_5Ap7SwKTvqm1QmdRzOYJb9JP"
};

// Now I need to require stripe and store the module in a variable in order to use it later in my script. I also add my private key defined just above.
var stripe = require("stripe")(myOwnKeys.private);


var dataBike = [
  {name: 'Model BIKO45', price: 679, url: '/images/bike-1.jpg'},
  {name: 'Model ZOOK7', price: 799, url: '/images/bike-2.jpg'},
  {name: 'Model LIKO89', price: 839, url: '/images/bike-3.jpg'},
  {name: 'Model GEWO', price: 1206, url: '/images/bike-4.jpg'},
  {name: 'Model TITAN5', price: 989, url: '/images/bike-5.jpg'},
  {name: 'Model AMIG39', price: 599, url: '/images/bike-6.jpg'}
];


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.dataCardBike == undefined) {
    req.session.dataCardBike = [];
  }
  res.render('index', {dataBike});
});

/* POST shop page. */
router.post('/shop', function(req, res, next) {

  req.session.dataCardBike.push(
    {
      name: req.body.bikeNameFromFront,
      price: req.body.bikePriceFromFront,
      url: req.body.bikeImageFromFront,
      quantity: req.body.bikeQuantityFromFront
    }
  );

  res.render('shop', {dataCardBike: req.session.dataCardBike});
});


/* GET delete shop page. */
router.get('/delete-shop', function(req, res, next) {

  req.session.dataCardBike.splice(req.query.position, 1);

  res.render('shop', {dataCardBike: req.session.dataCardBike});
});


/* POST update shop page. */
router.post('/update-shop', function(req, res, next) {

  req.session.dataCardBike[req.body.position].quantity = req.body.quantity;

  res.render('shop', {dataCardBike: req.session.dataCardBike});
});


/* POST checkout page. */
router.post('/checkout', function(req, res, next) {

  console.log("from checkout", req.session.dataCardBike)

  console.log("from checkout", req.body);

  // Here I need to permute "request" (as given in the Stripe doc) to "req" (as I defined it in the parameters of my route juste above.)
  // const token = request.body.stripeToken;

  const token = req.body.stripeToken;

  // Now, I want to :
  // 1- calculate the total price in my backend to prevent any error or "hacking"
  // 2- store some information related to the order in the description part of the charge.
  // NB: there are several ways to achieve the same purpose here.

  var totalCmdFromBackEnd = 0;
  var ordersReferences = [];

  for (var i = 0; i < req.session.dataCardBike.length; i++) {
    totalCmdFromBackEnd = totalCmdFromBackEnd + (req.session.dataCardBike[i].quantity * req.session.dataCardBike[i].price);
    ordersReferences.push(req.session.dataCardBike[i].name)
  };

  var name = req.body.stripeShippingName + " | ";
  var fullAddress = req.body.stripeShippingAddressLine1 + " - " + req.body.stripeShippingAddressZip + " - " + req.body.stripeShippingAddressCity + " | ";
  var ordersList = "Ref: "+ ordersReferences.join(' - ');

  const charge = stripe.charges.create({
    amount: totalCmdFromBackEnd*100,
    currency: 'eur',
    description: name + fullAddress + ordersList,
    source: token,
  }).then(req.session.dataCardBike = []);
  // BONUS: According to the Stripe documentation, I can use .then() to execute some code AFTER the execution of the charge script

  // BONUS : We could create a last view "confirm" for the user to deliver a confirmation message (OPTIONAL)
  res.render('confirm');
});








// // // // // //
// ***BONUS*** //
// // // // // //


// /* ***BONUS*** GET shop page. */
// // This bonus aims to give the user the possibity to reach the shop page without clicking on buy
router.get('/shop', function(req, res, next) {
  if(req.session.dataCardBike == undefined) {
    req.session.dataCardBike = [];
  }
  res.render('shop', {dataCardBike: req.session.dataCardBike});
});



// /* ***BONUS*** POST update shop page. */
// // This bonus aims to check to check if the requested quantity is 0, then delete the item, otherwise if not 0, then update the quantity
// router.post('/update-shop', function(req, res, next) {
//
//   if (req.body.quantity == 0) {
//     req.session.dataCardBike.splice(req.body.position, 1);
//   } else {
//     req.session.dataCardBike[req.body.position].quantity = req.body.quantity;
//   }
//
//   res.render('shop', {dataCardBike: req.session.dataCardBike});
// });




// /* ***BONUS*** POST shop page. */
// // // This bonus aims to check if the requested bike to add already exists in the shop basket, then we want to update the quantity of this bike but we do not want to add it, if not, add it.
// router.post('/shop', function(req, res, next) {
//
//
//   var mustbeUpdated = false;
//   for (var i = 0; i < req.session.dataCardBike.length; i++) {
//     if (req.body.bikeNameFromFront == req.session.dataCardBike[i].name) {
//       mustbeUpdated = true;
//       req.session.dataCardBike[i].quantity++
//     }
//   }
//   if (mustbeUpdated == false) {
//     req.session.dataCardBike.push(
//       {
//         name: req.body.bikeNameFromFront,
//         price: req.body.bikePriceFromFront,
//         url: req.body.bikeImageFromFront,
//         quantity: req.body.bikeQuantityFromFront
//       }
//     );
//   }
//
//   res.render('shop', {dataCardBike: req.session.dataCardBike});
// });

module.exports = router;
