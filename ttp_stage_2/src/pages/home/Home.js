import React, { Component } from 'react';
import Transaction from '../../components/transaction/Transaction';
import Portfolio from '../../components/portfolio/Portfolio';
import './Home.css';

class Home extends Component {
  state = {
    render: 'portfolio',
  };

  handleClick = event => {
    const target = event.target;
    const name = target.name;
    this.setState({
      render: name,
    });
  };

  render() {
    const { render } = this.state;
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
        {render === 'transaction' && <Transaction />}
        {render === 'portfolio' && <Portfolio />}
      </div>
    );
  }
}

export default Home;
