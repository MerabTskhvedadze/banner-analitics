import type { ReactNode } from "react";

export type Column<T> = {
  key: string;
  header: ReactNode;
  headerClassName?: string;
  render: (row: T, index: number) => ReactNode;
  cellClassName?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  rowClassName?: (row: T) => string;
  toolbar?: ReactNode;
  footer?: ReactNode;
  emptyState?: ReactNode;
  className?: string;
};

const thBase = "py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider";

export function DataTable<T>({
  columns,
  data,
  rowKey,
  rowClassName,
  toolbar,
  footer,
  emptyState,
  className,
}: DataTableProps<T>) {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden ${className ?? ""}`}>
      {toolbar}
      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`${thBase} ${col.headerClassName ?? ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.map((row, i) => (
                <tr
                  key={rowKey(row)}
                  className={`transition-colors group ${rowClassName?.(row) ?? "hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={col.cellClassName ?? "px-6 py-4"}
                    >
                      {col.render(row, i)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        emptyState
      )}
      {footer}
    </div>
  );
}
