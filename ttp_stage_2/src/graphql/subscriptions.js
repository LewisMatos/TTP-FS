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
        price
      }
      nextToken
    }
    transaction {
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
        price
      }
      nextToken
    }
    transaction {
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
        price
      }
      nextToken
    }
    transaction {
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
export const onCreateStock = `subscription OnCreateStock {
  onCreateStock {
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
    price
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
    price
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
    price
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
    price
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
    price
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
