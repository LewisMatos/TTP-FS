import React from 'react';

function Table(props) {
    let {items} = props
    return (
        <div className="table-container" role="table" aria-label="Destinations">
        <div className="flex-table header" role="rowgroup">
          <div className="flex-row first" role="columnheader">
            Symbol
          </div>
          <div className="flex-row" role="columnheader">
            Shares
          </div>
          <div className="flex-row" role="columnheader">
            Total
          </div>
          <div className="flex-row" role="columnheader">
            salePrice
          </div>
          <div className="flex-row" role="columnheader">
            $Market
          </div>
        </div>
        {items.map((stock, id) => {
          return (
            <div className="flex-table row" role="rowgroup" key={stock.id} style={{ background: `${stock.color}` }}>
              <div  className="flex-row first" role="cell"  >
                <span className="flag-icon flag-icon-gb" /> ${stock.ticker}
              </div>
              <div className="flex-row" role="cell">
                {stock.quantity}
              </div>
              <div className="flex-row" role="cell">
                ${(stock.lastSalePrice * stock.quantity).toFixed(2)}
              </div>
              <div className="flex-row" role="cell">
                ${stock.lastSalePrice}
              </div>
              <div className="flex-row" role="cell">
                ${stock.askPrice}
              </div>

            </div>

          );
        })}
      </div>
    );

    }
export default Table;