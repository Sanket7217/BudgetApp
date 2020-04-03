// Budget Controller
var budgetController = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,

        percentage: -1
    };

    var calcTotal = function(type){
        var sum = 0;

        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
    };


    return {
        addItem: function(type, des, val){
           var newItem, id;

            //create new id
            if (data.allItems[type].length > 0){
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else {
                id = 0;
            }


            if(type === 'exp'){
                newItem = new Expense(id, des, val);
            }else if(type === 'inc'){
                 newItem = new Income(id, des, val);
            }

            // add item to data list
            data.allItems[type].push(newItem);

            return newItem;
        },


        calculateBudget: function (){

            //calc total inc and exp
            calcTotal('inc');
            calcTotal('exp');

            // cal budget
            data.budget = data.totals.inc - data.totals.exp;


            //calc percentage
            if(data.totals.inc > 0){
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = -1;
            }

        },

        getBudget: function(){

            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage
            };
        },

        test: function(){
            console.log(data);
        }
    };

})();


//UI Controller
var UIController = (function(){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        budgetIncomeLabel : '.budget__income--value',
        budgetExpenseLabel: '.budget__expenses--value',
        budgetPercentageLabel: '.budget__expenses--percentage'
    };
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)

            };
        },

        addListItem : function(obj, type){

            var html, newHtml;
            //create HTML string

            if (type === 'inc'){
                element = DOMStrings.incomeContainer;
                html =  '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === 'exp'){
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }


            // replace text with User data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);


            // insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFeild: function(){

            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });
            fieldsArr[0].focus();

        },

        displayBudget: function(obj){

            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.budgetIncomeLabel).textContent = obj.totalIncome;
            document.querySelector(DOMStrings.budgetExpenseLabel).textContent = obj.totalExpenses;

            if(obj.percentage > 0){
               document.querySelector(DOMStrings.budgetPercentageLabel).textContent = obj.percentage + '%';
            }else {
                document.querySelector(DOMStrings.budgetPercentageLabel).textContent = '-';
            }

        },

        getDOMStrings: function(){
            return DOMStrings;
        }
    };

})();

// Global Controller
var Controller = (function(budgetCtrl, UICtrl){

    var setUpEventListeners = function(){
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
        if (event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
        });

    };


    var updateBudget = function() {

        //calculate budget
        budgetCtrl.calculateBudget();


        //return budget
        var budget = budgetCtrl.getBudget();


        // display to UI
        UICtrl.displayBudget(budget);

    };


    var ctrlAddItem = function(){

        var inputData, newItem;

        // get input data
        inputData = UICtrl.getInput();

        if(inputData.description !== ""  && !isNaN(inputData.value) && inputData.value > 0){
            // add item to budget
            newItem = budgetCtrl.addItem(inputData.type, inputData.description, inputData.value);

            //add item to UI
            UICtrl.addListItem(newItem, inputData.type);

            // clear input fields
            UICtrl.clearFeild();

            updateBudget();
        }

    };

    return {
        init: function(){
            console.log('application started');
            UICtrl.displayBudget({
                 budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: 0

            });
            setUpEventListeners();
        }
    };


})(budgetController,UIController);

Controller.init();
