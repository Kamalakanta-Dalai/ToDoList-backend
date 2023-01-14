//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));

mongoose.connect(
  "mongodb+srv://admin-kamalakanta:test2023@todolistcluster.4hqtooi.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
  }
);

//DAILY TASK DATA
const itemsSchema = {
  name: String,
  time: String,
};
const Item = mongoose.model("item", itemsSchema);
const item1 = new Item({
  name: "Buy Food",
  time: "08:00",
});
const item2 = new Item({
  name: "Cook Food",
  time: "08:30",
});
const item3 = new Item({
  name: "Eat Food",
  time: "09:00",
});
const defaultItems = [item1, item2, item3];

//WORK LIST DATA
const worksSchema = {
  name: String,
  date: Date,
};
const Work = mongoose.model("work", worksSchema);
const work1 = new Item({
  name: "Send Letter",
  date: 2023 / 01 / 03,
});
const defaultWorks = [work1];

app.get("/", function (req, res) {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let day = today.toLocaleDateString("en-US", options);

  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully Stored data.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        kindOfDay: day,
        newListItems: foundItems,
        NewTime: foundItems,
        Type: "time",
      });
    }
  });
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.button;
  //console.log(req.body.action);
  // if (req.body.list === "Work List") {
  //   Item.findByIdAndRemove(checkedItemId, function (err) {
  //     if (!err) {
  //       console.log("Successfully Deleted The Item.");
  //       res.redirect("/work");
  //     }
  //   });
  // } else {
  //   Item.findByIdAndRemove(checkedItemId, function (err) {
  //     if (!err) {
  //       console.log("Successfully Deleted The Item.");
  //       res.redirect("/");
  //     }
  //   });
  // }
  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (!err) {
      console.log("Successfully Deleted The Item.");
      res.redirect("/");
    }
  });
});

app.post("/", function (req, res) {
  let itemName = req.body.newItem;
  let timeTime = req.body.newTime;
  if (req.body.list === "Work List") {
    const work = new Work({
      name: itemName,
      date: timeTime,
    });
    work.save();

    res.redirect("/work");
  } else {
    const item = new Item({
      name: itemName,
      time: timeTime,
    });
    item.save();
    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  Work.find({}, function (err, foundWorks) {
    if (foundWorks.length === 0) {
      Work.insertMany(defaultWorks, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully Stored data.");
        }
      });
      res.redirect("/work");
    } else {
      res.render("list", {
        kindOfDay: "Work List",
        newListItems: foundWorks,
        NewTime: foundWorks,
        Type: "date",
      });
    }
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
