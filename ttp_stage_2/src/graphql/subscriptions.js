// eslint-disable
// this is an auto generated file. This will be overwritten

export const onCreateUser = `subscription OnCreateUser {
  onCreateUser {
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
export const onUpdateUser = `subscription OnUpdateUser {
  onUpdateUser {
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
export const onDeleteUser = `subscription OnDeleteUser {
  onDeleteUser {
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
export const onCreateStock = `subscription OnCreateStock {
  onCreateStock {
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
export const onUpdateStock = `subscription OnUpdateStock {
  onUpdateStock {
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
export const onDeleteStock = `subscription OnDeleteStock {
  onDeleteStock {
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
export const onCreateTransaction = `subscription OnCreateTransaction {
  onCreateTransaction {
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
export const onUpdateTransaction = `subscription OnUpdateTransaction {
  onUpdateTransaction {
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
export const onDeleteTransaction = `subscription OnDeleteTransaction {
  onDeleteTransaction {
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
