// Utility functions for export buttons
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function exportCopy(columns, rows, columnVisibility) {
  let data = '';
  const visibleCols = columns.filter(col => columnVisibility[col.key] && col.key !== 'manage');
  data += visibleCols.map(col => col.label).join('\t') + '\n';
  rows.forEach((role, idx) => {
    let row = [];
    visibleCols.forEach(col => {
      if (col.key === 'id') row.push(idx + 1);
      else row.push(role[col.key]);
    });
    data += row.join('\t') + '\n';
  });
  navigator.clipboard.writeText(data);
}

export function exportCSV(columns, rows, columnVisibility) {
  let csv = '';
  const visibleCols = columns.filter(col => columnVisibility[col.key] && col.key !== 'manage');
  csv += visibleCols.map(col => '"' + col.label + '"').join(',') + '\n';
  rows.forEach((role, idx) => {
    let row = [];
    visibleCols.forEach(col => {
      if (col.key === 'id') row.push(idx + 1);
      else row.push(role[col.key]);
    });
    csv += row.map(cell => '"' + cell + '"').join(',') + '\n';
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'RoleTable.csv';
  a.click();
  window.URL.revokeObjectURL(url);
}

export function exportExcel(columns, rows, columnVisibility) {
  const visibleCols = columns.filter(col => columnVisibility[col.key] && col.key !== 'manage');
  const wsData = [visibleCols.map(col => col.label)];
  rows.forEach((role, idx) => {
    let row = [];
    visibleCols.forEach(col => {
      if (col.key === 'id') row.push(idx + 1);
      else row.push(role[col.key]);
    });
    wsData.push(row);
  });
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'RoleTable');
  XLSX.writeFile(wb, 'RoleTable.xlsx');
}

export function exportPDF(columns, rows, columnVisibility) {
  const visibleCols = columns.filter(col => columnVisibility[col.key] && col.key !== 'manage');
  const doc = new jsPDF();
  const tableColumn = visibleCols.map(col => col.label);
  const tableRows = rows.map((role, idx) => {
    return visibleCols.map(col => {
      if (col.key === 'id') return idx + 1;
      return role[col.key];
    });
  });
  doc.autoTable({ head: [tableColumn], body: tableRows });
  doc.save('RoleTable.pdf');
}
