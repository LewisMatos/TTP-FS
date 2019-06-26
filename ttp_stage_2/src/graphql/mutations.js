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
        price
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
        price
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
        price
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
export const updateStock = `mutation UpdateStock($input: UpdateStockInput!) {
  updateStock(input: $input) {
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
export const deleteStock = `mutation DeleteStock($input: DeleteStockInput!) {
  deleteStock(input: $input) {
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
