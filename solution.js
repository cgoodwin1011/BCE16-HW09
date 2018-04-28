var desiredProduct = [];
var mysql = require("mysql");
require("console.table");
var inquirer = require("inquirer");
var chosen = 0;
var success = false;
var priorAmount = 100;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "mimojeff_db"
});

var confirmIt = [{
  type: "confirm",
  name: "satisfied",
  message: "Confirm Purchase?",
  default: "true"
}];

var askIfNotEnough = [{
  type: "list",
  name: "whatNow",
  message: "Would you like to...",
  choices: ["Try Another Purchase", "Quit"],
  filter: function (val) {
    switch (val) {
    case "Try Another Purchase":
      console.log("\nPlease restart to make another purchase");
      process.exit();
      break;
    case "Quit":
      process.exit();
      break;
    }
  }
}];

function summarizeOrder(numberBought, productName, itsPrice) {
  console.log("\nYou ordered:\n" + numberBought + " " + productName + " @ $" + itsPrice + " each\nYour total is $" + Math.round(itsPrice * numberBought * 100) / 100 + "\n(before tax & shipping)");
}

function updatingProductsTable(error, resp) {
  if (error) {
    console.log("error: " + error);
  } else if (resp) {
    // console.log("in updating table resp is "+resp[0]);
  } else {
    console.log("well this stinks");
  }
}

function outOfStockWarning(stockLevel) {
  console.log("\nWe do not have sufficient quatity.  \nWe have only " + stockLevel + " available.");
}

var filterInt = function(value) {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
    return Number(value);
  return NaN;
}

var chooseQuantity = {
  type: "input",
  message: "How many do you want?",
  name: "quantity_wanted",
  validate: function (value) {
    if (!Number.isInteger(filterInt(value))) {
      return "Please enter a whole number.";
    }
    if ((filterInt(value)) <= 0) {
      return "Minimum order is 1";
    }
    if (desiredProduct[0].stock_quantity - parseInt(value) < 0) {
      console.log("\nWe do not have sufficient quatity.  \nWe have only " + desiredProduct[0].stock_quantity + " available.");
      return "Please choose a quantity no more than "+desiredProduct[0].stock_quantity;
    } else {
      var remaining = desiredProduct[0].stock_quantity - value;
      priorAmount = desiredProduct[0].stock_quantity;
      desiredProduct[0].numOrdered = parseInt(value);
      var updateQuery = "UPDATE products SET stock_quantity = " + remaining + " WHERE item_id = " + chosen;
      connection.query(updateQuery, updatingProductsTable);
      return true;
    }
  }
};

function checkIfValidItem(numberWanted, numberAvailable) {
  if (numberWanted > 0 & numberWanted <= numberAvailable) {
    chosen = numberWanted;
    return true;
  } else {
    return "Please choose a number from 1 to 10.";
  }
}

function pushGlobal(err, res) {
  desiredProduct.push(res[0]);
}

var chooseProduct = {
  type: "input",
  name: "product_wanted",
  message: "Type the number of the item you wish to purchase: ",
  validate: function (value) {
    var isValid = checkIfValidItem(value, 10);
    if (isValid == true) {
      var someQuery = "SELECT * FROM products WHERE item_id="+value;
      connection.query(someQuery, pushGlobal);
    }
    return isValid;
  },
};

function confirmOrder() {
  
  inquirer.prompt(confirmIt).then(answers => {
    if (answers.satisfied) {
      console.log("Thank you for your patronage");
      process.exit();
    } else {
      console.log("We're sorry.  We'll restore our stock. Goodbye");
      var restoreQuery = "UPDATE products SET stock_quantity = " + priorAmount + " WHERE item_id = " + chosen;
      connection.query(restoreQuery, updatingProductsTable);
      process.exit();
    }
  });

}

function makePurchase(input) {
  console.table(input);
  inquirer.prompt([
    chooseProduct, chooseQuantity
  ]).then(answers => { /// add code here re adjust quantities, etc.
    summarizeOrder(desiredProduct[0].numOrdered, desiredProduct[0].product_name, desiredProduct[0].price);
    confirmOrder();
  });

}

function openStore(connected, func) {
  var query = "SELECT * FROM products";
  connected.query(query, function (err, res) {
    func(res);
  });
}

openStore(connection, makePurchase);