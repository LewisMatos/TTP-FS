// eslint-disable
// this is an auto generated file. This will be overwritten

export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    name
    cash
    stocks {
      items {
        id
        ticker
        quantity
        total
        askPrice
        lastSalePrice
      }
      nextToken
    }
    transaction {
      items {
        id
        ticker
        quantity
        askPrice
        lastSalePrice
      }
      nextToken
    }
  }
}
`;
export const listUsers = `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      cash
      stocks {
        nextToken
      }
      transaction {
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getStock = `query GetStock($id: ID!) {
  getStock(id: $id) {
    id
    ticker
    quantity
    total
    askPrice
    lastSalePrice
    user {
      id
      name
      cash
      stocks {
        nextToken
      }
      transaction {
        nextToken
      }
    }
  }
}
`;
export const listStocks = `query ListStocks(
  $filter: ModelStockFilterInput
  $limit: Int
  $nextToken: String
) {
  listStocks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      ticker
      quantity
      total
      askPrice
      lastSalePrice
      user {
        id
        name
        cash
      }
    }
    nextToken
  }
}
`;
export const getTransaction = `query GetTransaction($id: ID!) {
  getTransaction(id: $id) {
    id
    ticker
    quantity
    askPrice
    lastSalePrice
    user {
      id
      name
      cash
      stocks {
        nextToken
      }
      transaction {
        nextToken
      }
    }
  }
}
`;
export const listTransactions = `query ListTransactions(
  $filter: ModelTransactionFilterInput
  $limit: Int
  $nextToken: String
) {
  listTransactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      ticker
      quantity
      askPrice
      lastSalePrice
      user {
        id
        name
        cash
      }
    }
    nextToken
  }
}
`;
