var mysql = require("mysql");
var inquirer = require('inquirer');
var optionlist=[];
var pricelist=[];

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "1qaz6yhn2wsx!QAZ",
    database: "auctionDB"
  });

  var runobject={

    open: function(){
        connection.connect(function(err) {
            if (err) throw err;
            console.log("connected as id " + connection.threadId + "\n");
            runobject.interface();
        });
    },
    interface: function(){
        console.log("in interface");
        var context=this;
        inquirer.prompt([
          {
              message: "What did you want to do? ",
              type: "list",
              choices: ["Post an item", "Bid on an item", "logoff"],
              name: "search",
          },
      ]).then(answers => {
         switch(answers.search){
          case "Post an item": context.addstuff();
            break;
          case  "Bid on an item": context.bidtype();
            break;
          case "logoff":context.logoff();
            break;
          default:context.interface();
            break;
         }
      });
    },

    addstuff:function(){
        inquirer.prompt([
            {
                message: "What is the type of auction? ",
                type: "list",
                choices: ["items", "tasks", "jobs", "projects"],
                name: "type",
            },
          {
              message: "What is the item? ",
              type: "input",
              name: "name",
          },
        //   validate: function (input) {
        //       if (input !== undefined) {
        //         return true;
        //       }
        //       else {return false;}
        //   },
          {
            message: "What is the starting bid? ",
            type: "input",
            name: "bid",
        },
        // validate: function (input) {
        //   if (typeof input !== "integer") {
        //     // Pass the return value in the done callback
        //     return true;
        //   }else {return false;}
        // },
    ]).then(answers => {
        runobject.addstuff2(answers.type, answers.name, answers.bid);
     });
    },

    addstuff2: function(type, name, bid){
        var money=parseInt(bid);
        // connection.connect(function(err) {
        //   if (err) throw err;
        //   console.log("connected as id " + connection.threadId + "\n");
          connection.query(
            "INSERT INTO items SET ?",
          {
          typeof: type,
          nameof: name,
          highbid: money
          },
          function(err, res) {
            console.log(res.affectedRows + " item listed.\n");
            runobject.ender();
          }
          );
       // });
    },

    bidtype:function(){
        var context=this;
        var sql;
        inquirer.prompt([
            {
                message: "What is the type of auction? ",
                type: "list",
                choices: ["items", "tasks", "jobs", "projects", "all"],
                name: "type",
            },
        ]).then(answers => {
            switch(answers.search){
                case "items": sql='SELECT * FROM items WHERE typeof IN ("items")';
                  break;
                case  "tasks": sql='SELECT * FROM items WHERE typeof IN ("tasks")';
                  break;
                case "jobs":sql='SELECT * FROM items WHERE typeof IN ("jobs")';
                    break;
                case "projects": sql='SELECT * FROM items WHERE typeof IN ("projects")';
                    break;
                default:sql='SELECT * FROM items';
                  break;
               }
               context.bid(sql);
               console.log(sql);
         });
    },
    bid:function(sql){
        optionlist=[];
        // connection.connect(function(err) {
        //     if (err) throw err;
        //     console.log("connected as id " + connection.threadId + "\n");
            connection.query(sql,function(err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                console.log(res);
                for(var i=0; i<res.length;i++){
                    optionlist.push(res[i].nameof);
                }
                console.log(optionlist);
                runobject.bid2();
            });
       // });
    },
    bid2: function(){
        inquirer.prompt([
            {
                message: "Which item do you want to bid on? ",
                type: "list",
                choices: optionlist,
                name: "choice",
            },
        ]).then(answers => {
            runobject.bid3(answers.choice);
        })
    },
    bid3: function(){

    },


    ender: function(){
   // connection.end();
    this.interface();
    },
    logoff:function(){
        connection.end();
    },
}

runobject.open();
