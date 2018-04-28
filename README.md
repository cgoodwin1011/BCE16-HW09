# Project Title

This application allows for a customer to execute an online catalog purchase using a mysequel database.  

The program offers the user a menu of items to purchase that may be selected by entering an id number.  The program then asks for an order quantity.  The program error checks if the user orders more than is in stock and requests a revised purchase amount.  The program also error checks as to mistyped quantities.  Once the purchase is complete, the system asks for confirmation.   

The database is entitled "MiMoJeff" (for the mississippi-misouri-jefferson basin, the largest in N. America)  

## Getting Started

The program is designed to be run in node.js at the command line and will not run successfully on plain javascript.  This program may be invoked from the command line by typing the following: 
> node solution.js 

### Prerequisites

This program requires that you be running a mysql server appliation, which may be downloaded at https://dev.mysql.com/downloads/.  
This program requires the following npm packages be installed: mysql, console.table and inquirer

### Installing

Required npm packages may be installed via the command line at your working folder with:
> npm i mysql
> npm i inquirer
> npm i console.table
Links below.  

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* https://www.npmjs.com/package/console.table
* https://www.npmjs.com/package/inquirer
* https://www.npmjs.com/package/mysql

## Versioning

No versioning on this project.  

## Authors


* **Charles Goodwin ** - *Initial work* - (https://github.com/cgoodwin1011)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* The sample products listed here are taken from the absolutely brilliant -- http://wonderfulengineering.com/10-most-useless-products-that-you-can-buy-today/
