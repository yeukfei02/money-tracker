import React, { useState, useEffect, useMemo } from "react";
import { Text } from "grommet";
import { View, Edit, Trash } from "grommet-icons";
import BTable from "react-bootstrap/Table";
import { useTable, useSortBy, useRowSelect, usePagination } from "react-table";
import { useHistory } from "react-router";
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

function ExpensesTable(props: any) {
  const history = useHistory();

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
            Header: "Date",
            accessor: "date",
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
                  <View
                    className="mx-1 pointer"
                    color="blue"
                    onClick={() => handleViewButtonClick(rowId)}
                  />
                  <Edit
                    className="mx-1 pointer"
                    color="green"
                    onClick={() => handleEditButtonClick(rowId)}
                  />
                  <Trash
                    className="mx-1 pointer"
                    color="red"
                    onClick={() => handleDeleteButtonClick(rowId)}
                  />
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
  let [pageNumber, setPageNumber] = useState(0);
  let [pageSize, setPageSize] = useState(10);
  const [totalPageCount, setTotalPageCount] = useState(0);

  console.log("pageNumber = ", pageNumber + 1);
  console.log("pageSize = ", pageSize);

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    selectedFlatRows,
    state: { selectedRowIds },
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

  useEffect(() => {
    if (pageNumber >= 0 && pageSize >= 10) {
      getExpensesListRequest(pageNumber, pageSize);
    }
  }, [pageNumber, pageSize]);

  const getExpensesListRequest = async (
    pageNumber: number,
    pageSize: number
  ) => {
    try {
      const rootUrl = getRootUrl();
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await axios.get(`${rootUrl}/expenses`, {
        params: {
          pageNumber: pageNumber + 1,
          pageSize: pageSize,
          userId: userId,
        },
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
                item.date = dayjs(item.date).format("YYYY-MM-DD");
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
          setTotalPageCount(Math.ceil(responseData.allCount / pageSize));
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

  const deleteRowByIdRequest = async (id: string) => {
    try {
      const rootUrl = getRootUrl();
      const token = localStorage.getItem("token");

      const response = await axios.delete(`${rootUrl}/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (response.status === 200) {
          await getExpensesListRequest(pageNumber, pageSize);
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

  const handleViewButtonClick = async (rowId: number) => {
    console.log(rowId);
    history.push(`/expenses/details/${rowId}`);
  };

  const handleEditButtonClick = async (rowId: number) => {
    console.log(rowId);
    history.push(`/expenses/details/${rowId}`);
  };

  const handleDeleteButtonClick = async (rowId: number) => {
    console.log(rowId);
    if (rowId) {
      const rowIdStr = rowId.toString();
      await deleteRowByIdRequest(rowIdStr);
    }
  };

  return (
    <div className="mx-5 my-2">
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
                  onClick={() => setPageNumber(0)}
                  disabled={pageNumber === 0 ? true : false}
                >
                  {"<<"}
                </button>
              </li>
              <li className="page-item">
                <button
                  className="page-link pointer"
                  onClick={() => {
                    if (pageNumber > 0) {
                      pageNumber -= 1;
                      setPageNumber(pageNumber);
                    }
                  }}
                >
                  {"<"}
                </button>
              </li>
              <li className="page-item">
                <button
                  className="page-link pointer"
                  onClick={() => {
                    if (pageNumber < totalPageCount - 1) {
                      pageNumber += 1;
                      setPageNumber(pageNumber);
                    }
                  }}
                >
                  {">"}
                </button>
              </li>
              <li className="page-item">
                <button
                  className="page-link pointer"
                  onClick={() => setPageNumber(totalPageCount - 1)}
                  disabled={pageNumber === totalPageCount ? true : false}
                >
                  {">>"}
                </button>
              </li>
            </ul>
          </nav>
          <Text>
            Page{" "}
            <strong>
              {pageNumber + 1} of {totalPageCount}
            </strong>{" "}
          </Text>
          <Text>
            | Go to page:{" "}
            <input
              type="number"
              defaultValue={pageNumber + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                if (page >= 0 && page < totalPageCount) {
                  setPageNumber(page);
                }
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
    </div>
  );
}

export default ExpensesTable;
