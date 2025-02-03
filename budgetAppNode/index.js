const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({extended:true})); // for request post
app.use(express.static("public")); // for static files
app.set('view engine', 'ejs');

//fonction to get Month and year
function getDate() {
    const today = new Date();
    const options = {
        month: "long",
        year: "numeric"
    }
    return today.toLocaleDateString("en-US",options);
}

//var to store all depenses income and expenses
var allDepenses = [];

//function to calculate available budget 
function availableBudget(depenses) {
    let sum = 0;
    for (let i = 0; i < depenses.length; i++) {
        sum += depenses[i]["value"];
    }
    return parseFloat(sum).toFixed(2);
}

//fonction to return list of income or expenses 
function typeOfDepenses(isPositive, depenses){
    let positiveDepenses = []; //all incomes
    let negativeDepenses = []; // all expenses
    for (let i = 0; i < depenses.length; i++) {
        if (depenses[i]["value"] > 0) {
            positiveDepenses.push(depenses[i]);
        }else{
            negativeDepenses.push(depenses[i]);
        } 
    }

    if (isPositive) { //if true return pos values else neg
        return positiveDepenses;
    } else {
        return negativeDepenses;
    }
}

//fonction to return sum of income or expenses 
function sumOfDepenses(isPositive, depenses){
    let positiveDepenses = []; //all incomes
    let negativeDepenses = []; // all expenses
    for (let i = 0; i < depenses.length; i++) {
        if (depenses[i]["value"] > 0) {
            positiveDepenses.push(depenses[i]);
        }else{
            negativeDepenses.push(depenses[i]);
        } 
    }

    if (isPositive) { //if true return pos values else neg
        return availableBudget(positiveDepenses);
    } else {
        return availableBudget(negativeDepenses);
    }
}
//function to calculate the expenses %
function expensesPercentage(depenses) {
    //calculate sums of all incomes and expenses
    let sumOfAllIncomes = sumOfDepenses(true, depenses);
    if (sumOfAllIncomes > 0){
        // we change expenses into positive values
        let sumOfAllExpenses = sumOfDepenses(false, depenses) * -1
        return ((sumOfAllExpenses * 100) / sumOfAllIncomes).toFixed(2);
    }
    return 0;
}

app.get("/", function(req,res){
    //if there is at least one depense and last depense is negative then the select is set to keep on negative
    var choice = true;
    if (allDepenses.length > 1 && allDepenses[allDepenses.length - 1].value < 0 ) {
        var choice = false;
    }

    res.render("index",{
        date : getDate(),
        availableBudget : availableBudget(allDepenses),
        income : sumOfDepenses(true,typeOfDepenses(true, allDepenses)),
        expenses : sumOfDepenses(false,typeOfDepenses(false, allDepenses)),
        percentage : expensesPercentage(allDepenses),
        listOfIncomes : typeOfDepenses(true, allDepenses),
        listOfExpenses :  typeOfDepenses(false, allDepenses),
        choice : choice
    });
});

app.post("/", function(req,res) {
    let newTitle = req.body.title;
    let newValue = Number(parseFloat(req.body.value).toFixed(2));
    let type = req.body.choice;

    if (type === "expenses") {// if select is expenses we change value to negatif
        newValue *= -1 ;
    }
    
    let newDepense = {
        id : allDepenses.length,
        title : newTitle,
        value : newValue
    }
    allDepenses.push(newDepense);
     res.redirect("/");
});

app.post("/delete", function(req,res) {
    let idToDelete = Number(req.body.depense);
    for (let i = 0; i < allDepenses.length; i++) {
        if (allDepenses[i].id === idToDelete) {
            var depenseToDelete = allDepenses[i];
        }
    }
    
    if (allDepenses.includes(depenseToDelete)) {
        let indexOfDepenseToDelete = allDepenses.indexOf(depenseToDelete);
        console.log(indexOfDepenseToDelete); 
        allDepenses.splice(indexOfDepenseToDelete,1);  
    } else{
        console.log("Not found");
    } 
    res.redirect("/");
});

app.listen(3000,function() {
    console.log("Running");
})



