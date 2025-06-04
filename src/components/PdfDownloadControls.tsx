import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, ToggleLeft, ToggleRight } from 'lucide-react';
import jsPDF from 'jspdf';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  created_at: string;
}

interface PdfDownloadControlsProps {
  messages: Message[];
  sessionId: string | null;
  selectedMessages: Set<string>;
  setSelectedMessages: React.Dispatch<React.SetStateAction<Set<string>>>;
  showCheckboxes: boolean;
  setShowCheckboxes: React.Dispatch<React.SetStateAction<boolean>>;
}

const PdfDownloadControls: React.FC<PdfDownloadControlsProps> = ({
  messages,
  sessionId,
  selectedMessages,
  setSelectedMessages,
  showCheckboxes,
  setShowCheckboxes,
}) => {
  const parseTableFromText = (text: string) => {
    const lines = text.split('\n');
    const tableRows: string[][] = [];
    
    for (const line of lines) {
      if (line.includes('|') && line.trim() !== '') {
        const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell !== '');
        if (cells.length > 0) {
          tableRows.push(cells);
        }
      }
    }
    
    return tableRows.length > 1 ? tableRows : null;
  };

  const addTableToPdf = (doc: jsPDF, table: string[][], startY: number) => {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const tableWidth = pageWidth - (margin * 2);
    const colWidth = tableWidth / table[0].length;
    
    let currentY = startY;
    
    table.forEach((row, rowIndex) => {
      let maxCellHeight = 0;
      const cellTexts: string[][] = [];
      
      // Prepare cell texts and calculate max height
      row.forEach((cell, cellIndex) => {
        const cellText = doc.splitTextToSize(cell, colWidth - 4);
        cellTexts.push(cellText);
        const cellHeight = cellText.length * 6;
        maxCellHeight = Math.max(maxCellHeight, cellHeight);
      });
      
      // Check if we need a new page
      if (currentY + maxCellHeight > doc.internal.pageSize.height - 20) {
        doc.addPage();
        currentY = 20;
      }
      
      // Draw row background for header
      if (rowIndex === 0) {
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, currentY, tableWidth, maxCellHeight, 'F');
      }
      
      // Draw cells
      row.forEach((cell, cellIndex) => {
        const x = margin + (cellIndex * colWidth);
        
        // Draw cell border
        doc.setDrawColor(200, 200, 200);
        doc.rect(x, currentY, colWidth, maxCellHeight);
        
        // Add text
        doc.setFontSize(9);
        doc.setTextColor(rowIndex === 0 ? 60 : 80);
        const cellText = cellTexts[cellIndex];
        cellText.forEach((line: string, lineIndex: number) => {
          doc.text(line, x + 2, currentY + 8 + (lineIndex * 6));
        });
      });
      
      currentY += maxCellHeight;
    });
    
    return currentY + 10;
  };

  const downloadPdf = () => {
    if (selectedMessages.size === 0) {
      alert('Please select at least one message to download.');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;

    // Title
    doc.setFontSize(16);
    doc.setTextColor(60, 60, 60);
    doc.text('Chat Conversation', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    const selectedMessagesList = messages.filter(msg => selectedMessages.has(msg.id));

    selectedMessagesList.forEach((message, index) => {
      // Check if we need a new page
      if (yPosition > doc.internal.pageSize.height - 40) {
        doc.addPage();
        yPosition = 20;
      }

      // Message header with colored sender label
      doc.setFontSize(12);
      if (message.sender === 'user') {
        doc.setTextColor(59, 130, 246); // Blue for user
        doc.text('User:', 20, yPosition);
      } else {
        doc.setTextColor(147, 51, 234); // Purple for assistant
        doc.text('AI Assistant:', 20, yPosition);
      }
      yPosition += 10;

      // Message content
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);

      // Check if message contains tables
      const table = parseTableFromText(message.content);
      
      if (table) {
        // Split content into text and table parts
        const lines = message.content.split('\n');
        const textLines = lines.filter(line => !line.includes('|') || line.trim() === '');
        const textContent = textLines.join('\n').trim();
        
        // Add text content if exists
        if (textContent) {
          const textLines = doc.splitTextToSize(textContent, pageWidth - 40);
          textLines.forEach((line: string) => {
            if (yPosition > doc.internal.pageSize.height - 20) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(line, 20, yPosition);
            yPosition += 6;
          });
          yPosition += 5;
        }
        
        // Add table
        yPosition = addTableToPdf(doc, table, yPosition);
      } else {
        // Regular text content
        const lines = doc.splitTextToSize(message.content, pageWidth - 40);
        lines.forEach((line: string) => {
          if (yPosition > doc.internal.pageSize.height - 20) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, 20, yPosition);
          yPosition += 6;
        });
      }

      yPosition += 10;

      // Add separator line between messages
      if (index < selectedMessagesList.length - 1) {
        doc.setDrawColor(220, 220, 220);
        doc.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 10;
      }
    });

    doc.save('chat-conversation.pdf');
  };

  const toggleSelectAll = () => {
    if (selectedMessages.size === messages.length) {
      setSelectedMessages(new Set());
    } else {
      setSelectedMessages(new Set(messages.map(msg => msg.id)));
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowCheckboxes(!showCheckboxes)}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            {showCheckboxes ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            <span>{showCheckboxes ? 'Hide Selection' : 'Select Messages'}</span>
          </Button>
          
          {showCheckboxes && (
            <>
              <Button
                onClick={toggleSelectAll}
                variant="outline"
                size="sm"
              >
                {selectedMessages.size === messages.length ? 'Deselect All' : 'Select All'}
              </Button>
              
              <Badge variant="secondary">
                {selectedMessages.size} selected
              </Badge>
            </>
          )}
        </div>

        {showCheckboxes && selectedMessages.size > 0 && (
          <Button
            onClick={downloadPdf}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <FileDown className="w-4 h-4" />
            <span>Download PDF</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default PdfDownloadControls;
