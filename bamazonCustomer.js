var mysql = require("mysql");
var inquirer = require('inquirer');
const Tablefy = require("tablefy");



var optionlist=[];
var buynum=0;
var inventory=0;
var price=0;
var sales=0;
var id=0;

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
            let table = new Tablefy();
            for(var i=0; i<res.length; i++){
                optionlist.push(res[i].item_id);
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
            message: "What is the id of the product you want to buy? ",
            type: "input",
            //choices: optionlist,
            name: "id",
            // validate: function (input) {
            // if (optionlist.indexof(parseInt(input)) >-1 ) {
            //     // Pass the return value in the done callback
            //     return true;
            // }else {return false;}
            // },
        },
        {
            message: "How many you want to buy? ",
            type: "input",
            name: "quant",
            validate: function (input) {
            if (typeof input !== "integer") {
                return true;
            }else {return false;}
            },
        },
        ]).then(answers => {
            id=parseFloat(answers.id);
            buynum=parseInt(answers.quant);
            connection.query("select * from products where ?;",
            {
                item_id: answers.id,
            },
            function(err, res) {
                if(err){console.log(err)}
              if(res[0].stock_quantity<answers.quant){
                console.log(`Insufficient quantity!`);
                runobject.display();
              }else{
                inventory=parseInt(res[0].stock_quantity);
                price=parseFloat(res[0].price);
                sales=parseFloat(res[0].product_sales);
                runobject.buyitem();
              }
            })
        });
    },

    buyitem: function(){
    inventory-=buynum;
    sales+=price*buynum;
    var sql="UPDATE products SET stock_quantity="+inventory+", product_sales="+sales+" WHERE item_id="+id+";";
    connection.query(sql,
    function(err, res) {
        if(err){console.log(err)}
        runobject.display();
    })   
    },
}

runobject.open();
