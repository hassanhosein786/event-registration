import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";
import { Eye, Printer, Download, Trash2 } from "lucide-react";
import Button from "./Button";
import { calculateAge, formatDateTime } from "../utils/formatters";
import { campTypeOptions } from "../utils/constants";

const columnHelper = createColumnHelper();
const formatCampType = (value) => campTypeOptions.find((option) => option.value === value)?.label || value || "-";

const RegistrationsTable = ({ data, onView, onDelete, onPrint, onDownload }) => {
  const columns = [
    columnHelper.accessor("registrationId", {
      header: "ID",
      cell: (info) => <span className="font-mono text-xs text-brand-200">{info.getValue()}</span>
    }),
    columnHelper.accessor("fullName", { header: "Name" }),
    columnHelper.accessor("school", { header: "School" }),
    columnHelper.accessor("classLevel", { header: "Class Level" }),
    columnHelper.accessor("campType", {
      header: "Camp Type",
      cell: (info) => formatCampType(info.getValue())
    }),
    columnHelper.accessor("email", { header: "Email" }),
    columnHelper.accessor("phone", { header: "Phone" }),
    columnHelper.accessor("gender", { header: "Gender" }),
    columnHelper.accessor("dateOfBirth", {
      header: "Age",
      cell: (info) => calculateAge(info.getValue())
    }),
    columnHelper.accessor("submittedAt", {
      header: "Submitted",
      cell: (info) => formatDateTime(info.getValue())
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => onView(row.original)}>
            <Eye className="mr-1 h-3.5 w-3.5" /> View
          </Button>
          <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => onPrint(row.original)}>
            <Printer className="mr-1 h-3.5 w-3.5" /> Print
          </Button>
          <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => onDownload(row.original)}>
            <Download className="mr-1 h-3.5 w-3.5" /> PDF
          </Button>
          <Button variant="danger" className="px-3 py-2 text-xs" onClick={() => onDelete(row.original)}>
            <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      )
    })
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-slate-950/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-white/5">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-white/5">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-4 align-top text-sm text-slate-200">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistrationsTable;
