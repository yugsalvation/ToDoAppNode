var express=require("express");
var app=express();
var admin = require('firebase-admin');
var bodyParser = require('body-parser');
var serviceAccount = require("/Users/yugrawal/Downloads/node-abf8b-firebase-adminsdk-fm3hv-4a80266410.json");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://node-abf8b.firebaseio.com"
});
var db=admin.database();
var ref = db.ref("ToDoApp/");
var count=0;
app.set("view engine","ejs"); //using ejs

app.get("/",function(req,res){
var uref = db.ref("ToDoApp/todo/");
  uref.on("value", function(snapshot) {
  var data=snapshot.val();
  console.log(snapshot.val());
  function sort_by_key(array, key)
{
 return array.sort(function(a, b)
 {
  var x = a[key]; var y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
 });
}
data = sort_by_key(data, 'date');
  res.render("index",{data:data});
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

});


var f=10;
app.post("/redirect",urlencodedParser,function(req,res){
  //console.log(req.body.todo);
var uref = ref.child("counter");
  var x=  uref.once("value", function(snapshot) {
        count=Number(snapshot.val());
    console.log("above counter"+count);
    ++count;

    console.log("count is"+count);
    //uref.update(count);
    var usersRef = ref.child("todo");
    usersRef.child(count).set({
    date:req.body.date,
    time:req.body.time,
    todo:req.body.todo
    });
    ref.update({counter:count});

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });




setInterval(function(){
  res.redirect("/");},1000);

});
app.listen(3000);
