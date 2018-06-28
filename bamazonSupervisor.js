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
            if(err){console.log(err)}
            //console.log(res);
            localdata=[];
            let table = new Tablefy();
            for(var i=0; i<res.length; i++){
                optionlist.push(res[i].item_id);
                localdata.push(res[i]);
            }
            //console.log(optionlist);
            //table.draw(res);
            runobject.interface();
        })   
    },

    interface: function(){
        //var context=this;
        inquirer.prompt([
        {
            message: "What do you want to do? ",
            type: "list",
            choices: [`View Product Sales by Department`, `Create New Department`],
            name: "choice",
        },
        ]).then(answers => {
            switch(answers.choice){
                case `View Product Sales by Department`: runobject.display();
                    break;
                case `Create New Department`: runobject.adddept();
                    break;
                default:runobject.interface();
                    break;
            }
        });
    },

    
    adddept: function(){
        optionlist=[];
        for(var i=0; i<localdata.length;i++){
            if(optionlist.indexOf(localdata[i].department_name)==-1){
                optionlist.push(localdata[i].department_name);
            }
        }
        console.log(optionlist);
        inquirer.prompt([
            {
                message: "What is name of the department you want to add? ",
                type: "input",
                name: "name",
            },
            {
                message: "What is it's overhead cost? ",
                type: "input",
                name: "price",
                validate: function (input) {
                if (typeof parseFloat(input) !== "float") {
                    return true;
                }else {return false;}
                },
            },
            ]).then(answers => {
                var sql="INSERT INTO departments (department_name, over_head_costs) VALUES ('"+answers.name+"', "+answers.price+");";
                connection.query(sql,
                function(err, res) {
                    if(err){console.log(err)}
                    runobject.display();
                })   
            });
    }

}

runobject.open();