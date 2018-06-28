var mysql = require("mysql");
var inquirer = require('inquirer');
const Tablefy = require("tablefy");



var optionlist=[];
var buynum=0;
var inventory=0;
var price=0;
var sales=0;
var id=0;
var localdata=[];
var indexer=0;

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "",
    database: "bamazon"
  });

  var runobject={

    open: function(){
        connection.connect(function(err) {
            if (err) throw err;
            console.log("connected as id " + connection.threadId + "\n");
            runobject.display();
        });
    },

    display: function(){
        connection.query("select * from products;",
        function(err, res) {
            //console.log(res);
            localdata=[];
            let table = new Tablefy();
            for(var i=0; i<res.length; i++){
                optionlist.push(res[i].item_id);
                localdata.push(res[i]);
            }
            //console.log(optionlist);
            table.draw(res);


            runobject.interface();
        })   
    },

    interface: function(){
        //var context=this;
        inquirer.prompt([
        {
            message: "What do you want to do? ",
            type: "list",
            choices: [`View Products for Sale`, `View Low Inventory`, `Add to Inventory`,`Add New Product`],
            name: "choice",

        },
        ]).then(answers => {
            switch(answers.choice){
                case `View Products for Sale`: runobject.display();
                    break;
                case `View Low Inventory`: runobject.viewlow();
                    break;
                case `Add to Inventory`: runobject.addstuff();
                    break;
                case `Add New Product`: runobject.newstuff();
                    break;
                default:runobject.interface();
                    break;
            }
        });
    },

    addstuff: function(){

        inquirer.prompt([
            {
                message: "What is id of the product you want to add inventory to? ",
                type: "input",
                name: "id",
                validate: function (input) {
                if (typeof input !== "integer") {
                    return true;
                }else {return false;}
                },
            },
            {
                message: "How many you want to add? ",
                type: "input",
                name: "quant",
                validate: function (input) {
                if (typeof input !== "integer") {
                    return true;
                }else {return false;}
                },
            },
            ]).then(answers => {
                for(var i=0; i<localdata.length; i++){
                    if(localdata[i].item_id===answers.id){
                        indexer=i;
                    }
                }
                inventory=parseInt(localdata[indexer].stock_quantity);
                inventory+=parseInt(answers.quant);
                var sql="UPDATE products SET stock_quantity="+inventory+" WHERE item_id="+answers.id+";";
                connection.query(sql,
                function(err, res) {
                    if(err){console.log(err)}
                    runobject.display();
                })   
            });
    },

    viewlow: function(){
        connection.query("select * from products where stock_quantity<5;",
        function(err, res) {
            let table = new Tablefy();
            table.draw(res);
            runobject.interface();
        })   
    },
    newstuff: function(){
        optionlist=[];
        for(var i=0; i<localdata.length;i++){
            if(optionlist.indexOf(localdata[i].department_name)==-1){
                optionlist.push(localdata[i].department_name);
            }
        }
        console.log(optionlist);
        inquirer.prompt([
            {
                message: "What is name of the product you want to add? ",
                type: "input",
                name: "name",
            },
            {
                message: "How many are in stock? ",
                type: "input",
                name: "quant",
                validate: function (input) {
                if (typeof input !== "integer") {
                    return true;
                }else {return false;}
                },
            },
            {
                message: "What is it's price? ",
                type: "input",
                name: "price",
                validate: function (input) {
                if (typeof parseFloat(input) !== "float") {
                    return true;
                }else {return false;}
                },
            },
            {
                message: "What department is the item under? ",
                type: "list",
                name: "dept",
                choices: optionlist,
            },
            ]).then(answers => {
            
                var sql="INSERT INTO products (product_name, department_name, stock_quantity, price) VALUES ('"+answers.name+"', '"+answers.dept+"', "+answers.quant+", "+answers.price+");";
                connection.query(sql,
                function(err, res) {
                    if(err){console.log(err)}
                    runobject.display();
                })   
            });
    }

}

runobject.open();