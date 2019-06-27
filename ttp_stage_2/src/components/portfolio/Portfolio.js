import React, { Component } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { createStock, updateStock, updateUser, createTransaction } from '../../graphql/mutations';
import { getUser, listStocks } from '../../graphql/queries';

class Portfolio extends Component {
  state = {
    cash: 0,
    stocks: [],
    colors: { low: '#f20d0d', equal: '#A9A6A5', high: '#4AD847' },
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

    this.performanceInterval = setInterval(async () => {
      const { stocks, colors } = this.state;
      if (stocks.length > 0 && stocks !== undefined) {
        let tickers = stocks.map(stock => stock.ticker);
        let currentStocks = await this.getStocks(tickers.join(','));
        currentStocks.forEach((stock, id) => {
          if (stocks[id].askPrice < stock.askPrice) {
            stocks[id].color = colors.low;
          } else if (stock.askPrice === stocks[id].askPrice) {
            stocks[id].color = colors.equal;
          } else {
            stocks[id].color = colors.high;
          }
          this.setState({ stocks });
        });
      }
    }, 5000);
  };

  getStocks = async tickers => {
    const endpoint = `https://cloud.iexapis.com/stable/tops?token=pk_ecbab72853cd4c92b7ccde66561abfbf&symbols=${tickers}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
  };
  componentWillUnmount() {
    clearInterval(this.performanceInterval);
  }

  getUserCred = async () => {
    let user = await Auth.currentAuthenticatedUser();
    this.setState({ id: user.attributes.sub });
  };

  getStock = async () => {
    const { ticker, quantity } = this.state;
    const endpoint = `https://cloud.iexapis.com/stable/tops?token=pk_ecbab72853cd4c92b7ccde66561abfbf&symbols=${ticker}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    if (data !== undefined && data.length > 0) {
      const stockData = {
        ticker: data[0].symbol,
        askPrice: data[0].askPrice,
        lastSalePrice: data[0].lastSalePrice,
        quantity,
      };
      this.setState({ stockData });
      this.createStock();
    }
  };

  updateStock = async input => {
    const { stocks } = this.state;
    let res = await API.graphql(graphqlOperation(updateStock, { input }));
    const { total, quantity, id } = res.data.updateStock;
    const index = stocks.findIndex(stock => stock.id === id);
    stocks[index] = { ...stocks[index], total, quantity };
    this.setState({ stocks });
  };

  updateUser = async () => {
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
    const { lastSalePrice, ticker, quantity } = data;
    const input = {
      lastSalePrice: lastSalePrice,
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
        const input = {
          ticker: stockData.ticker,
          total: stockData.askPrice * stockData.quantity,
          askPrice: stockData.askPrice,
          lastSalePrice: stockData.lastSalePrice,
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
            {stocks.map((stock, id) => {
              return (
                <ul key={stock.id} className="row">
                  <li style={{ color: `${stock.color}` }}>
                    {stock.ticker} - {stock.quantity} Shares
                  </li>
                  <li style={{ color: `${stock.color}` }}>${stock.total.toFixed(2)}</li>
                </ul>
              );
            })}
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
