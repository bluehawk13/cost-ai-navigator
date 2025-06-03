
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText } from 'lucide-react';
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
}

const PdfDownloadControls: React.FC<PdfDownloadControlsProps> = ({ messages, sessionId }) => {
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [showCheckboxes, setShowCheckboxes] = useState(false);

  const handleMessageToggle = (messageId: string) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId);
    } else {
      newSelected.add(messageId);
    }
    setSelectedMessages(newSelected);
  };

  const selectAllMessages = () => {
    const nonWelcomeMessages = messages.filter(msg => !msg.id.startsWith('welcome-'));
    setSelectedMessages(new Set(nonWelcomeMessages.map(msg => msg.id)));
  };

  const clearSelection = () => {
    setSelectedMessages(new Set());
  };

  const generatePDF = () => {
    if (selectedMessages.size === 0) {
      return;
    }

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = 30;

    // Add title
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Chat Session Export', margin, yPosition);
    yPosition += 15;

    // Add session info
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Session ID: ${sessionId?.slice(0, 8) || 'N/A'}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Export Date: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 20;

    // Filter and sort selected messages
    const selectedMessagesList = messages
      .filter(msg => selectedMessages.has(msg.id))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    selectedMessagesList.forEach((message, index) => {
      // Check if we need a new page
      if (yPosition > pdf.internal.pageSize.getHeight() - 40) {
        pdf.addPage();
        yPosition = 30;
      }

      // Add message header
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      const senderLabel = message.sender === 'user' ? 'You' : 'AI Assistant';
      const timestamp = new Date(message.created_at).toLocaleString();
      pdf.text(`${senderLabel} - ${timestamp}`, margin, yPosition);
      yPosition += 8;

      // Add message content
      pdf.setFont('helvetica', 'normal');
      
      // Clean and format the content
      let content = message.content;
      
      // Remove markdown formatting for PDF
      content = content.replace(/[#*`]/g, '');
      content = content.replace(/\|/g, ' | ');
      
      // Split content into lines that fit the page width
      const lines = pdf.splitTextToSize(content, maxWidth);
      
      lines.forEach((line: string) => {
        if (yPosition > pdf.internal.pageSize.getHeight() - 20) {
          pdf.addPage();
          yPosition = 30;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 6;
      });

      yPosition += 10; // Add space between messages
    });

    // Save the PDF
    const fileName = `chat-session-${sessionId?.slice(0, 8) || 'export'}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    // Reset state
    setShowCheckboxes(false);
    setSelectedMessages(new Set());
  };

  const nonWelcomeMessages = messages.filter(msg => !msg.id.startsWith('welcome-'));

  if (nonWelcomeMessages.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 border-b border-gray-200">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowCheckboxes(!showCheckboxes)}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        {showCheckboxes ? 'Cancel Selection' : 'Select for PDF'}
      </Button>

      {showCheckboxes && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={selectAllMessages}
            className="text-blue-600 hover:text-blue-700"
          >
            Select All
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="text-gray-600 hover:text-gray-700"
          >
            Clear Selection
          </Button>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-600">
              {selectedMessages.size} selected
            </span>
            <Button
              onClick={generatePDF}
              disabled={selectedMessages.size === 0}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PdfDownloadControls;
