import React, { useMemo } from "react";
import BTable from "react-bootstrap/Table";
import { useTable, useSortBy } from "react-table";

function Table({ columns, data }: any) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

  const firstPageRows = rows.slice(0, 20);

  // Render the UI for your table
  return (
    <div>
      <BTable striped bordered hover size="sm" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th
                  className="p-2"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td className="p-2" {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </BTable>
    </div>
  );
}

function ExpensesTable(props: any) {
  const columns = useMemo(
    () => [
      {
        Header: "Info",
        columns: [
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Description",
            accessor: "description",
          },
        ],
      },
      {
        Header: "Details",
        columns: [
          {
            Header: "Type",
            accessor: "type",
          },
          {
            Header: "Currency",
            accessor: "currency",
          },
          {
            Header: "Amount",
            accessor: "amount",
          },
          {
            Header: "Created at",
            accessor: "created_at",
          },
        ],
      },
    ],
    []
  );

  return (
    <div className="mx-5 my-2">
      <Table columns={columns} data={props.data} />
    </div>
  );
}

export default ExpensesTable;
