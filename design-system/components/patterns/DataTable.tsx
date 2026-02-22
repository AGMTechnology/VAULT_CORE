import type { ReactNode } from "react";
import { Card } from "../primitives/Card";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "../primitives/Table";

export type DataTableColumn<T> = {
  readonly id: string;
  readonly label: ReactNode;
  readonly render: (row: T) => ReactNode;
};

export type DataTableProps<T> = {
  readonly columns: ReadonlyArray<DataTableColumn<T>>;
  readonly rows: ReadonlyArray<T>;
  readonly empty?: ReactNode;
};

export function DataTable<T>({ columns, rows, empty }: DataTableProps<T>) {
  return (
    <Card className="ds-data-table">
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableHeaderCell key={column.id}>{column.label}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={`${rowIndex}-${column.id}`}>{column.render(row)}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>{empty ?? "No data available."}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
