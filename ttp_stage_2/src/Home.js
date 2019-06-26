import React, { Component } from 'react';
import './Home.css';

class Home extends Component {
  state = {
    amount: 5000,
    stocks: [
      { name: 'AAPL', amount: 6, price: 2000 },
      { name: 'AAPL', amount: 6, price: 2000 },
      { name: 'AAPL', amount: 6, price: 2000 },
      { name: 'AAPL', amount: 6, price: 2000 },
    ],
    ticker: '',
    quantity: '',
  };

  handleChange = event => {
    const target = event.target;
    const name = target.name;
    this.setState({
      [name]: target.value,
    });
  };

  getData = async() => {
    let query = this.state.ticker;
    let endpoint = `https://cloud.iexapis.com/?filter=aapl`;
    fetch(endpoint)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(responseJson => {
        console.log(responseJson);
        // this.addData(responseJson);
      })
      .catch(error => {
        console.log(error);
        // this.setState({ inputClass: 'animated shake search red' });
        // setTimeout(() => this.setState({ inputClass: 'search' }), 1000);
      });
  };
  handleSubmit = async event => {
    event.preventDefault();
    this.getData()
    this.setState({ ticker: '', quantity: '' });
  };
  render() {
    const { amount, stocks } = this.state;
    return (
      <div>
        <div className="Home-header">
          <h1>Portfolio (${amount})</h1>
        </div>
        <div className="Home-portfolio">
          <div className="Home-list">
            {stocks.map((stock, id) => {
              return (
                <ul key={id} className="row">
                  <li>
                    {stock.name} - {stock.amount} Shares
                  </li>
                  <li>${stock.price}</li>
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
