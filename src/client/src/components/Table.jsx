import React from 'react';

export function Table({ columns = [], rows = [], getRowKey = (row, idx) => row.id ?? idx }) {
  return (
    <div className="ui-table-card">
      <table className="ui-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={getRowKey(row, idx)}>
              {columns.map((col) => (
                <td key={col.key}>
                  {typeof col.render === 'function' ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}