import React, { useState, useEffect, useMemo } from "react";
import { Text } from "grommet";
import BTable from "react-bootstrap/Table";
import { useTable, useSortBy, useRowSelect, usePagination } from "react-table";
import dayjs from "dayjs";
import axios from "axios";
import { getRootUrl } from "../../helpers/helpers";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }: any, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = (ref || defaultRef) as any;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

function Table({ columns, data }: any) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

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
          {page.map((row, i) => {
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

      <div>
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item">
              <button
                className="page-link pointer"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                {"<<"}
              </button>
            </li>
            <li className="page-item">
              <button
                className="page-link pointer"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                {"<"}
              </button>
            </li>
            <li className="page-item">
              <button
                className="page-link pointer"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                {">"}
              </button>
            </li>
            <li className="page-item">
              <button
                className="page-link pointer"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                {">>"}
              </button>
            </li>
          </ul>
        </nav>
        <Text>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </Text>
        <Text>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </Text>
        <select
          className="mx-3"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>

        <br />
        <br />
        <pre>
          <code>
            {JSON.stringify(
              {
                selectedRowIds: selectedRowIds,
                "selectedFlatRows[].original": selectedFlatRows.map(
                  (d) => d.original
                ),
              },
              null,
              2
            )}
          </code>
        </pre>
      </div>
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
      {
        Header: "Actions",
        columns: [
          {
            Header: "Actions",
            accessor: (row: any) => {
              const rowId = row ? row.id : 0;

              return (
                <div className="d-flex flex-row">
                  <button
                    type="button"
                    className="btn btn-primary mx-2"
                    onClick={() => handleViewButtonClick(rowId)}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="btn btn-success mx-2"
                    onClick={() => handleEditButtonClick(rowId)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger mx-2"
                    onClick={() => handleDeleteButtonClick(rowId)}
                  >
                    Delete
                  </button>
                </div>
              );
            },
          },
        ],
      },
    ],
    []
  );

  const [data, setData] = useState([]);

  useEffect(() => {
    getExpensesListRequest();
  }, []);

  const getExpensesListRequest = async () => {
    try {
      const rootUrl = getRootUrl();
      const token = localStorage.getItem("token");

      const response = await axios.get(`${rootUrl}/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (responseData) {
          const expensesList = responseData.expenses;
          const formattedExpensesList = expensesList.map(
            (item: any, i: number) => {
              if (item) {
                item.created_at = dayjs(item.created_at).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
                item.updated_at = dayjs(item.updated_at).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
              }

              return item;
            }
          );
          setData(formattedExpensesList);
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

  const handleViewButtonClick = (rowId: number) => {
    console.log(rowId);
  };

  const handleEditButtonClick = (rowId: number) => {
    console.log(rowId);
  };

  const handleDeleteButtonClick = (rowId: number) => {
    console.log(rowId);
  };

  return (
    <div className="mx-5 my-2">
      <Table columns={columns} data={data} />
    </div>
  );
}

export default ExpensesTable;
