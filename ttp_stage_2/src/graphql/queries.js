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
        price
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
    price
    user {
      id
      name
      cash
      stocks {
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
      price
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
