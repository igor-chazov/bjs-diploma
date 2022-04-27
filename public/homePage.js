const logoutButton = new LogoutButton();

logoutButton.action = function () {
  ApiConnector.logout(response => {

    if (response.success === true) {
      location.reload();
    }

  });
}

ApiConnector.current(response => {

  if (response.success === true) {
    ProfileWidget.showProfile(response.data);
  }

});

const ratesBoard = new RatesBoard();

function getCurrentStocks() {
  ApiConnector.getStocks(response => {

    if (response.success === true) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }

  });
}

getCurrentStocks();

setInterval(getCurrentStocks, 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = function (data) {
  ApiConnector.addMoney(data, response => {

    if (response.success === true) {
      ProfileWidget.showProfile(response.data);
      this.setMessage(response.success, `Счет успешно пополнен на сумму ${data.amount} ${data.currency}`);
    } else {
      this.setMessage(response.success, response.error);
    }

  });
}

moneyManager.conversionMoneyCallback = function (data) {
  ApiConnector.convertMoney(data, response => {

    if (response.success === true) {
      ProfileWidget.showProfile(response.data);
      this.setMessage(response.success, `Успешно конвертирована сумма в размере ${data.fromAmount} ${data.fromCurrency} в ${data.targetCurrency}`);
    } else {
      this.setMessage(response.success, response.error);
    }

  });
}

moneyManager.sendMoneyCallback = function (data) {
  ApiConnector.transferMoney(data, response => {

    if (response.success === true) {
      ProfileWidget.showProfile(response.data);
      this.setMessage(response.success, `Успешно переведена сумма в размере ${data.amount} ${data.currency} пользователю с id ${data.to}`);
    } else {
      this.setMessage(response.success, response.error);
    }

  });
}

const favoritesWidget = new FavoritesWidget();

function favoritesClearFillUpdate(response) {
  favoritesWidget.clearTable();
  favoritesWidget.fillTable(response.data);
  moneyManager.updateUsersList(response.data);
}

ApiConnector.getFavorites(response => {

  if (response.success === true) {
    favoritesClearFillUpdate(response);
  }

});

favoritesWidget.addUserCallback = function (data) {
  ApiConnector.addUserToFavorites(data, response => {

    if (response.success === true) {
      favoritesClearFillUpdate(response);
      this.setMessage(response.success, `Успешно добавлен пользователь ${data.name} с id ${data.id}`);
    }
    else {
      this.setMessage(response.success, response.error);
    }

  });
}

favoritesWidget.removeUserCallback = function (data) {
  ApiConnector.removeUserFromFavorites(data, response => {

    if (response.success === true) {
      favoritesClearFillUpdate(response);
      this.setMessage(response.success, `Успешно удален пользователь с id ${data}`);
    } else {
      this.setMessage(response.success, response.error);
    }

  });
}