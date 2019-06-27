import React, { Component } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { createStock, updateStock, updateUser } from './graphql/mutations';
import { getUser, listStocks } from './graphql/queries';
import './Home.css';

class Home extends Component {
  state = {
    cash: 0,
    stocks: [],
    data: {},
    ticker: '',
    quantity: '',
    id: '',
  };

  componentDidMount = async () => {
    await this.getUserCred();
    const stocks = await API.graphql(graphqlOperation(listStocks));
    const user = await API.graphql(graphqlOperation(getUser, { id: this.state.id }));
    const { cash } = user.data.getUser;
    this.setState({ stocks: stocks.data.listStocks.items, cash });
  };
  getUserCred = async () => {
    let user = await Auth.currentAuthenticatedUser();
    this.setState({ id: user.attributes.sub });
  };
  getData = async () => {
    const { ticker, quantity } = this.state;
    const endpoint = `https://cloud.iexapis.com/stable/tops?token=pk_ecbab72853cd4c92b7ccde66561abfbf&symbols=${ticker}`;
    const response = await fetch(endpoint);
    let data = await response.json();
    data = {
      ticker: data[0].symbol,
      price: data[0].lastSalePrice,
      quantity,
    };
    // await this.getUserCred();
    this.setState({ data });
    this.createStock();
  };

  createStock = async () => {
    const { id, data, cash, stocks } = this.state;
    const { ticker, quantity, price } = data;
    const input = {
      ticker,
      price: price * quantity,
      stockUserId: id,
      quantity: parseInt(quantity),
    };
    const stock = await API.graphql(graphqlOperation(getUser, { id })); //check db for stock
    let foundStock = stock.data.getUser.stocks.items.find(item => item.ticker === ticker);
    //update or create stock
    if (foundStock) {
      {
        const { price, quantity, id } = foundStock;
        const newPrice = input.price + price;
        const newQuantity = input.quantity + quantity;
        const updatedInput = {
          id,
          ticker,
          quantity: newQuantity,
          price: newPrice,
        };
        if (cash >= 0 && cash > (data.price * quantity)) {
          let data = await API.graphql(graphqlOperation(updateStock, { input: updatedInput }));
          let index = stocks.findIndex(stock => stock.id === data.data.updateStock.id);
          const { price, quantity } = data.data.updateStock;
          stocks[index] = { ...stocks[index], price, quantity };
          this.setState({ stocks });
        }
      }
    } else {
      if (cash >= 0 && cash > (price * quantity)) {
        let data = await API.graphql(graphqlOperation(createStock, { input }));
        const stocks = [...this.state.stocks, data.data.createStock];
        this.setState({ stocks });
      }
    }
    if (cash > 0 && cash > (price * quantity)) {
      const input = {
        id,
        cash: parseInt(cash - price * quantity),
      };
      await API.graphql(graphqlOperation(updateUser, { input: input }));

    console.log(cash);
    this.setState({
      cash: parseInt(cash - price * quantity),
    });
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
    this.getData();
    this.setState({ ticker: '', quantity: '' });
  };

  render() {
    const { cash, stocks } = this.state;
    return (
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
    );
  }
}

export default Home;
