import * as XLSX from 'xlsx'
export function exportClientExcel(client, rows){
  if(!rows || rows.length===0){ alert('Aucun article pour ce client'); return }
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, client.substring(0,31))
  const wbout = XLSX.write(wb, { bookType:'xlsx', type:'array' })
  const blob = new Blob([wbout], { type:'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = `mrdps_${client.replace(/[^a-z0-9]/gi,'_')}_${new Date().toISOString().split('T')[0]}.xlsx`; a.click(); URL.revokeObjectURL(url)
}
