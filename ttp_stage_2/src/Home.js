import React, { Component } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { createStock, updateStock, updateUser, createTransaction } from './graphql/mutations';
import { getUser, listStocks, listTransactions } from './graphql/queries';
import {onCreateTransaction} from './graphql/subscriptions'
import './Home.css';

class Home extends Component {
  state = {
    cash: 0,
    stocks: [],
    transactions: [],
    stockData: {},
    render: 'portfolio',
    ticker: '',
    quantity: '',
    id: '',
  };

  componentDidMount = async () => {
    await this.getUserCred();
    const stocks = await API.graphql(graphqlOperation(listStocks));
    API.graphql(graphqlOperation(onCreateTransaction)).subscribe({
      next: data =>{
        let transactions =[
          ...this.state.transactions, data.value.data.onCreateTransaction
        ]
        this.setState({transactions })
      }
    })
    const transactions = await API.graphql(graphqlOperation(listTransactions));
      console.log(transactions)
    const user = await API.graphql(graphqlOperation(getUser, { id: this.state.id }));
    const { cash } = user.data.getUser;
    this.setState({
      stocks: stocks.data.listStocks.items,
      cash,
      transactions: transactions.data.listTransactions.items,
    });
  };

  getUserCred = async () => {
    let user = await Auth.currentAuthenticatedUser();
    this.setState({ id: user.attributes.sub });
  };

  getData = async () => {
    const { ticker, quantity } = this.state;
    const endpoint = `https://cloud.iexapis.com/stable/tops?token=pk_ecbab72853cd4c92b7ccde66561abfbf&symbols=${ticker}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    const stockData = {
      ticker: data[0].symbol,
      price: data[0].lastSalePrice,
      quantity,
    };
    this.setState({ stockData });
    this.createStock();
  };

  updateStock = async input => {
    const { stocks } = this.state;
    let res = await API.graphql(graphqlOperation(updateStock, { input }));
    const { price, quantity, id } = res.data.updateStock;
    const index = stocks.findIndex(stock => stock.id === id);
    stocks[index] = { ...stocks[index], price, quantity };
    this.setState({ stocks });
  };

  updateUser = async () => {
    const { id, stockData, cash } = this.state;
    const { quantity, price } = stockData;
    const total = price * quantity;
    if (cash > 0 && cash > total) {
      const input = {
        id,
        cash: parseInt(cash - total),
      };
      await API.graphql(graphqlOperation(updateUser, { input: input }));
      this.setState({
        cash: parseInt(cash - price * quantity),
      });
    }
  };

  createTransaction = async data => {
    const { id } = this.state;
    const { price, ticker, quantity } = data;
    const input = {
      price,
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

  createStock = async () => {
    const { id, stockData, cash } = this.state;
    const foundStock = await this.stockExistsInDb();
    const total = stockData.price * stockData.quantity;

    if (cash >= 0 && cash > total) {
      if (foundStock) {
        //update stock
        const { price, quantity, id } = foundStock;
        const newPrice = stockData.price + price;
        const newQuantity = parseInt(stockData.quantity) + quantity;
        let input = {
          id,
          ticker: stockData.ticker,
          quantity: newQuantity,
          price: newPrice,
        };
        this.updateStock(input);
      } else {
        //create stock
        const input = {
          ticker: stockData.ticker,
          price: stockData.price * stockData.quantity,
          stockUserId: id,
          quantity: parseInt(stockData.quantity),
        };
        let res = await API.graphql(graphqlOperation(createStock, { input }));
        const stocks = [...this.state.stocks, res.data.createStock];
        this.setState({ stocks });
      }
      this.createTransaction(stockData);
    }
    this.updateUser();
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
    this.getData();
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
    const { cash, stocks, transactions, render } = this.state;
    return (
      <div>
        <nav className="Home-nav">
          <a onClick={this.handleClick} name="portfolio" href="#!">
            Portfolio
          </a>
          <a onClick={this.handleClick} name="transaction" href="#!">
            Transactions
          </a>
        </nav>
        {render === 'transaction' && (
          <div className="Home-transaction">
            <div className="Home-header">
              <h1>Transaction </h1>
            </div>
            <div className="Home-portfolio">
              <div className="Home-list">
                {transactions.map((tran, id) => {
                  return (
                    <ul key={id} className="row">
                      <li>
                        BUY ({tran.ticker}) - {tran.quantity} Shares @
                      </li>
                      <li>${tran.price.toFixed(2)}</li>
                    </ul>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {render === 'portfolio' && (
          <div>
            <div className="Home-header">
              <h1>Portfolio (${cash})</h1>
            </div>
            <div className="Home-portfolio">
              <div className="Home-list">
                {stocks.map((stock, id) => {
                  return (
                    <ul key={id} className="row">
                      <li>
                        {stock.ticker} - {stock.quantity} Shares
                      </li>
                      <li>${stock.price.toFixed(2)}</li>
                    </ul>
                  );
                })}
              </div>
              <form onSubmit={this.handleSubmit} className="Home-form" name="Home-form">
                <input
                  type="text"
                  name="ticker"
                  required
                  placeholder="ticker"
                  value={this.state.ticker}
                  onChange={this.handleChange}
                />
                <input
                  type="number"
                  name="quantity"
                  required
                  placeholder="quantity"
                  value={this.state.quantity}
                  onChange={this.handleChange}
                />
                <button type="submit"> SUBMIT </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Home;
