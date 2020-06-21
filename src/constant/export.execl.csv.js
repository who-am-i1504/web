
export function exportCvs(title, cvs_columns, cvs_data) {
  this.$export.csv({
    title: title,
    columns: cvs_columns,
    data: cvs_data
  }).then(() => {
    this.$message('导出CSV成功')
  })
}

export function exportExecl(title, execl_columns, execl_data) {
  this.$export.excel({
    title: title,
    columns: execl_columns,
    data: execl_data
  }).then(() => {
    this.$message('导出表格成功')
  })
}