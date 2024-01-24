var budgetController = (function () {
    var Budget = function (id, category, amount) {
      this.id = id;
      this.category = category;
      this.amount = amount;
    };
  
    var data = {
      allBudgets: [],
    };
  
    return {
      addBudget: function (category, amount) {
        var newBudget, ID;
  
        if (data.allBudgets.length > 0) {
          ID = data.allBudgets[data.allBudgets.length - 1].id + 1;
        } else {
          ID = 0;
        }
  
        newBudget = new Budget(ID, category, amount);
        data.allBudgets.push(newBudget);
        return newBudget;
      },
  
      deleteBudget: function (id) {
        var ids, index;
  
        ids = data.allBudgets.map(function (current) {
          return current.id;
        });
  
        index = ids.indexOf(id);
  
        if (index !== -1) {
          data.allBudgets.splice(index, 1);
        }
      },
  
      getBudgets: function () {
        return data.allBudgets;
      },
    };
  })();
  
  var UIController = (function () {
    var DOMstrings = {
      categoryInput: '.add-budget__category',
      amountInput: '.add-budget__amount',
      addButton: '.add-budget__btn',
      budgetList: '.budget-list',
    };
  
    return {
      getBudgetInput: function () {
        return {
          category: document.querySelector(DOMstrings.categoryInput).value,
          amount: parseFloat(document.querySelector(DOMstrings.amountInput).value),
        };
      },
  
      addBudgetToList: function (budget) {
        var html, newHtml, element;
  
        element = DOMstrings.budgetList;
  
        html =
          '<li class="budget-list__item" id="budget-%id%"><span class="budget-list__category">%category%</span><span class="budget-list__amount">%amount%</span><span class="budget-list__delete"><i class="ion-ios-close-outline"></i></span></li>';
  
        newHtml = html.replace('%id%', budget.id);
        newHtml = newHtml.replace('%category%', budget.category);
        newHtml = newHtml.replace('%amount%', budget.amount);
  
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
      },
  
      deleteBudgetFromList: function (selectorID) {
        var el = document.getElementById(selectorID);
        el.parentNode.removeChild(el);
      },
  
      clearFields: function () {
        var fields, fieldsArr;
  
        fields = document.querySelectorAll(
          DOMstrings.categoryInput + ', ' + DOMstrings.amountInput
        );
  
        fieldsArr = Array.prototype.slice.call(fields);
  
        fieldsArr.forEach(function (current, index, array) {
          current.value = '';
        });
  
        fieldsArr[0].focus();
      },
  
      getDOMstrings: function () {
        return DOMstrings;
      },
    };
  })();
  var controller = (function (budgetCtrl, UICtrl) {
    var setupEventListeners = function () {
      var DOM = UICtrl.getDOMstrings();
  
      document.querySelector(DOM.addButton).addEventListener('click', ctrlAddBudget);
  
      document.addEventListener('keypress', function (event) {
        if (event.keyCode === 13 || event.which === 13) {
          ctrlAddBudget();
        }
      });
  
      document.querySelector(DOM.budgetList).addEventListener('click', ctrlDeleteBudget);
    };
  
    var updateBudgetList = function () {
      var budgets, newBudget;
  
      // 1. Get the budget data from the budget controller
      budgets = budgetCtrl.getBudgets();
  
      // 2. Add each budget to the UI
      budgets.forEach(function (current) {
        UICtrl.addBudgetToList(current);
      });
    };
  
    var updateBudgetLimit = function () {
      var budgetLimit = parseFloat(document.getElementById('budget-limit').textContent);
      var remainingBudget = budgetLimit;
  
      // Get all budgets
      var budgets = budgetCtrl.getBudgets();
  
      // Calculate remaining budget
      budgets.forEach(function (budget) {
        remainingBudget -= budget.amount;
      });
  
      // Update the UI with the remaining budget
      document.getElementById('budget-remaining').textContent = remainingBudget.toFixed(2);
  
      // Change color based on remaining budget
      if (remainingBudget < 0) {
        document.getElementById('budget-remaining').style.color = '#e57373';
      } else {
        document.getElementById('budget-remaining').style.color = '#4caf50';
      }
    };
  
    var ctrlAddBudget = function () {
      var input, newBudget;
  
      // 1. Get the input data
      input = UICtrl.getBudgetInput();
  
      if (input.category !== '' && !isNaN(input.amount) && input.amount > 0) {
        // 2. Add the budget to the budget controller
        newBudget = budgetCtrl.addBudget(input.category, input.amount);
  
        // 3. Add the budget to the UI
        UICtrl.addBudgetToList(newBudget);
  
        // 4. Update the budget limit and remaining budget
        updateBudgetLimit();
  
        // 5. Clear the fields
        UICtrl.clearFields();
      }
    };
  
    var ctrlDeleteBudget = function (event) {
      var budgetID, splitID, category, amount;
  
      // Get the budget ID (format: budget-ID)
      budgetID = event.target.parentNode.parentNode.id;
  
      if (budgetID) {
        // Split the ID to get category and ID
        splitID = budgetID.split('-');
        category = splitID[0];
        amount = parseFloat(splitID[1]);
  
        // 1. Delete the budget from the budget controller
        budgetCtrl.deleteBudget(category, amount);
  
        // 2. Delete the budget from the UI
        UICtrl.deleteBudgetFromList(budgetID);
  
        // 3. Update the budget limit and remaining budget
        updateBudgetLimit();
      }
    };
  
    return {
        init: function () {
          console.log('Application has started.');
          UICtrl.displayMonth();
          UICtrl.displayYear();
          updateBudgetList();
          updateBudgetLimit();
          setupEventListeners();
        },
      };
    })(budgetController, UIController);
    
    controller.init();