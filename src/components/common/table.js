import React from 'react';

const Table = ({ headers, data, renderRow }) => {
  return (
    <div className="table-card">
      <div className="table-card__scroll">
        <table className="data-table">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="data-table__head">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {renderRow(item)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;