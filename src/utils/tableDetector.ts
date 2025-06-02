
export interface TableData {
  headers: string[];
  rows: string[][];
}

export const detectTablesInText = (text: string): TableData[] => {
  const tables: TableData[] = [];
  
  // Split text into lines
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let currentTable: TableData | null = null;
  let inTable = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if line contains table-like structure (|, multiple spaces, or tabs)
    const hasTableMarkers = line.includes('|') || /\s{3,}/.test(line) || line.includes('\t');
    const cells = extractCellsFromLine(line);
    
    if (hasTableMarkers && cells.length > 1) {
      if (!inTable) {
        // Start new table
        currentTable = {
          headers: cells,
          rows: []
        };
        inTable = true;
      } else if (currentTable) {
        // Check if this is a separator line (like |---|---|)
        const isSeparator = cells.every(cell => /^[-\s|:=]+$/.test(cell));
        if (!isSeparator) {
          // Add as data row
          currentTable.rows.push(cells);
        }
      }
    } else {
      if (inTable && currentTable && currentTable.rows.length > 0) {
        // End current table
        tables.push(currentTable);
        currentTable = null;
        inTable = false;
      }
    }
  }
  
  // Add the last table if it exists
  if (inTable && currentTable && currentTable.rows.length > 0) {
    tables.push(currentTable);
  }
  
  return tables.filter(table => table.rows.length > 0);
};

const extractCellsFromLine = (line: string): string[] => {
  // Remove leading/trailing pipes and split by various delimiters
  let cleanLine = line.replace(/^\||\|$/g, '').trim();
  
  // Try different splitting strategies
  let cells: string[] = [];
  
  if (cleanLine.includes('|')) {
    cells = cleanLine.split('|');
  } else if (cleanLine.includes('\t')) {
    cells = cleanLine.split('\t');
  } else {
    // Split by multiple spaces
    cells = cleanLine.split(/\s{2,}/);
  }
  
  return cells.map(cell => cell.trim()).filter(cell => cell.length > 0);
};

export const isNumericData = (data: string[][]): boolean => {
  if (data.length === 0) return false;
  
  // Check if most values in the data are numeric
  let numericCount = 0;
  let totalCount = 0;
  
  data.forEach(row => {
    row.forEach(cell => {
      totalCount++;
      if (!isNaN(parseFloat(cell)) && isFinite(parseFloat(cell))) {
        numericCount++;
      }
    });
  });
  
  return totalCount > 0 && (numericCount / totalCount) > 0.5;
};

export const prepareChartData = (table: TableData) => {
  const { headers, rows } = table;
  
  return rows.map((row, index) => {
    const dataPoint: any = { name: row[0] || `Row ${index + 1}` };
    
    headers.slice(1).forEach((header, i) => {
      const value = row[i + 1];
      dataPoint[header] = !isNaN(parseFloat(value)) ? parseFloat(value) : value;
    });
    
    return dataPoint;
  });
};
