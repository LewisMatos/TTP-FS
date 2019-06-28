import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listTransactions } from '../../graphql/queries';
import { onCreateTransaction } from '../../graphql/subscriptions';
import Table from '../table/Table'

class Transaction extends Component {
  state = {
    transactions: [],
  };

  componentDidMount = async () => {
    const transactions = await API.graphql(graphqlOperation(listTransactions));
    this.setState({
      transactions: transactions.data.listTransactions.items,
    });
    this.createTransactionListener = API.graphql(graphqlOperation(onCreateTransaction)).subscribe({
      next: data => {
        let transactions = [...this.state.transactions, data.value.data.onCreateTransaction];
        this.setState({ transactions });
      },
    });
  };

  componentWillUnmount() {
    this.createTransactionListener.unsubscribe();
  }

  render() {
    const { transactions } = this.state;
    return (
      <div className="Home-transaction">
        <div className="Home-header">
          <h1>Transactions</h1>
        </div>
        <div className="Home-portfolio">
          <div className="Home-list">
            <Table items={transactions} />
          </div>
        </div>
      </div>
    );
  }
}

export default Transaction;
