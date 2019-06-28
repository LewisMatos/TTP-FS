import React, { Component } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { createStock, updateStock, updateUser, createTransaction } from '../../graphql/mutations';
import { getUser, listStocks } from '../../graphql/queries';
import Table from '../table/Table';

class Portfolio extends Component {
  state = {
    cash: 0,
    stocks: [],
    colors: { low: '#f20d0d', equal: '#5e5c5b', high: '#4AD847' },
    stockData: {},
    render: 'portfolio',
    ticker: '',
    quantity: '',
    id: '',
  };

  componentDidMount = async () => {
    await this.getUserCred();
    const stocks = await API.graphql(graphqlOperation(listStocks));
    const user = await API.graphql(graphqlOperation(getUser, { id: this.state.id }));
    const { cash } = user.data.getUser;
    this.setState({
      stocks: stocks.data.listStocks.items,
      cash,
    });

    //Update market ask price
    this.performanceInterval = setInterval(async () => {
      const { stocks, colors } = this.state;
      if (stocks.length > 0 && stocks !== undefined) {
        let tickers = stocks.map(stock => stock.ticker);
        let currentStocks = await this.getStocks(tickers.join(','));
        currentStocks.forEach((currentStock, id) => {
          if (currentStock.askPrice > stocks[id].lastSalePrice) {
            stocks[id].color = colors.high;
          } else if (currentStock.askPrice === stocks[id].lastSalePrice) {
            stocks[id].color = colors.equal;
          } else {
            stocks[id].color = colors.low;
          }
          stocks[id].askPrice = currentStock.askPrice;
          this.setState({ stocks });
        });
      }
    }, 2000);
  };

  componentWillUnmount() {
    clearInterval(this.performanceInterval);
  }

  getStocks = async tickers => {
    const endpoint = `https://cloud.iexapis.com/stable/tops?token=pk_ecbab72853cd4c92b7ccde66561abfbf&symbols=${tickers}`;
    const response = await fetch(endpoint);
    const stocks = await response.json();
    return stocks;
  };

  getUserCred = async () => {
    let user = await Auth.currentAuthenticatedUser();
    this.setState({ id: user.attributes.sub });
  };

  getStock = async () => {
    const { ticker, quantity } = this.state;
    const endpoint = `https://cloud.iexapis.com/stable/tops?token=pk_ecbab72853cd4c92b7ccde66561abfbf&symbols=${ticker}`;
    const response = await fetch(endpoint);
    const stock = await response.json();
    if (stock !== undefined && stock.length > 0) {
      if (stock[0].askPrice > 0) {
        const stockData = {
          ticker: stock[0].symbol,
          askPrice: stock[0].askPrice,
          lastSalePrice: stock[0].lastSalePrice,
          quantity,
        };
        this.setState({ stockData });
        this.createOrUpdateStock();
      }
    }
  };

  createStock = async input => {
    let { stocks } = this.state;
    let res = await API.graphql(graphqlOperation(createStock, { input }));
    stocks = [...stocks, res.data.createStock];
    this.setState({ stocks });
  };

  updateStock = async input => {
    const { stocks } = this.state;
    let res = await API.graphql(graphqlOperation(updateStock, { input }));
    const { total, quantity, id } = res.data.updateStock;
    const index = stocks.findIndex(stock => stock.id === id);
    stocks[index] = { ...stocks[index], total, quantity };
    this.setState({ stocks });
  };

  updateUserCash = async () => {
    const { id, stockData, cash } = this.state;
    const { quantity, askPrice } = stockData;
    const total = askPrice * quantity;
    if (cash > 0 && cash > total) {
      const input = {
        id,
        cash: parseInt(cash - total),
      };
      await API.graphql(graphqlOperation(updateUser, { input: input }));
      this.setState({
        cash: parseInt(cash - askPrice * quantity),
      });
    }
  };

  createTransaction = async data => {
    const { id } = this.state;
    const { lastSalePrice, ticker, quantity, askPrice } = data;
    const input = {
      askPrice,
      lastSalePrice,
      quantity,
      ticker,
      transactionUserId: id,
    };
    await API.graphql(graphqlOperation(createTransaction, { input }));
  };

  stockExistsInDb = async () => {
    const { id, stockData } = this.state;
    const { ticker } = stockData;
    const res = await API.graphql(graphqlOperation(getUser, { id })); //check db for stock
    return res.data.getUser.stocks.items.find(item => item.ticker === ticker);
  };

  createOrUpdateStock = async () => {
    const { id, stockData, cash } = this.state;
    const foundStock = await this.stockExistsInDb();
    const total = stockData.askPrice * stockData.quantity;

    if (cash >= 0 && cash > total) {
      if (foundStock) {
        //update stock
        const { total, quantity, id, askPrice } = foundStock;
        const newTotal = stockData.askPrice + total;
        const newQuantity = parseInt(stockData.quantity) + quantity;
        let input = {
          id,
          ticker: stockData.ticker,
          quantity: newQuantity,
          total: newTotal,
          askPrice: stockData.askPrice,
          lastSalePrice: askPrice,
        };
        this.updateStock(input);
      } else {
        //create stock
        const total = stockData.askPrice * stockData.quantity;
        const { ticker, askPrice, lastSalePrice } = stockData;
        const input = {
          ticker,
          total,
          askPrice,
          lastSalePrice,
          stockUserId: id,
          quantity: parseInt(stockData.quantity),
        };
        this.createStock(input);
      }
      this.createTransaction(stockData);
      this.updateUserCash();
    }
  };

  handleChange = event => {
    const target = event.target;
    const name = target.name;
    this.setState({
      [name]: target.value,
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.getStock();
    this.setState({ ticker: '', quantity: '' });
  };

  handleClick = event => {
    const target = event.target;
    const name = target.name;
    this.setState({
      render: name,
    });
  };

  render() {
    const { stocks, cash } = this.state;
    return (
      <div>
        <div className="Home-header">
          <h1>Portfolio (${cash})</h1>
        </div>
        <div className="Home-portfolio">
          <div className="Home-list">
            <Table items={stocks} />
          </div>

          <form onSubmit={this.handleSubmit} className="Home-form" name="Home-form">
            <h1>Cash - ${cash}</h1>
            <input
              type="text"
              name="ticker"
              required
              placeholder="Ticker"
              value={this.state.ticker}
              onChange={this.handleChange}
            />
            <input
              type="number"
              name="quantity"
              required
              placeholder="Quantity"
              value={this.state.quantity}
              onChange={this.handleChange}
            />
            <button className="Home-button" type="submit">
              BUY
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Portfolio;
