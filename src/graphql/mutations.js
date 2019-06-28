// eslint-disable
// this is an auto generated file. This will be overwritten

export const createUser = `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
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
export const updateUser = `mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
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
export const deleteUser = `mutation DeleteUser($input: DeleteUserInput!) {
  deleteUser(input: $input) {
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
export const createStock = `mutation CreateStock($input: CreateStockInput!) {
  createStock(input: $input) {
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
export const updateStock = `mutation UpdateStock($input: UpdateStockInput!) {
  updateStock(input: $input) {
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
export const deleteStock = `mutation DeleteStock($input: DeleteStockInput!) {
  deleteStock(input: $input) {
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
export const createTransaction = `mutation CreateTransaction($input: CreateTransactionInput!) {
  createTransaction(input: $input) {
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
export const updateTransaction = `mutation UpdateTransaction($input: UpdateTransactionInput!) {
  updateTransaction(input: $input) {
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
export const deleteTransaction = `mutation DeleteTransaction($input: DeleteTransactionInput!) {
  deleteTransaction(input: $input) {
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
