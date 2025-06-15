
import jsPDF from 'jspdf';
import { Node, Edge } from '@xyflow/react';

interface ExportOptions {
  nodes: Node[];
  edges: Edge[];
  workflowName?: string;
}

export const exportWorkflowToPDF = ({ nodes, edges, workflowName = 'Untitled Workflow' }: ExportOptions) => {
  const pdf = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  
  // Enhanced header design
  pdf.setFillColor(59, 130, 246);
  pdf.rect(0, 0, pageWidth, 45, 'F');
  
  // Title with white text
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text(workflowName, margin, 25);
  
  // Subtitle with light blue background
  pdf.setFillColor(239, 246, 255);
  pdf.rect(0, 45, pageWidth, 20, 'F');
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(59, 130, 246);
  pdf.text(`AI Workflow Diagram • Generated on ${new Date().toLocaleDateString()}`, margin, 58);
  
  // Summary section with improved styling
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Workflow Overview', margin, 80);
  
  // Summary cards
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(margin, 85, 70, 20, 3, 3, 'F');
  pdf.roundedRect(margin + 80, 85, 70, 20, 3, 3, 'F');
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(71, 85, 105);
  pdf.text('Components', margin + 5, 95);
  pdf.text('Connections', margin + 85, 95);
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(59, 130, 246);
  pdf.text(nodes.length.toString(), margin + 5, 102);
  pdf.text(edges.length.toString(), margin + 85, 102);
  
  // Enhanced Visual Diagram Section - Much Larger
  let yPosition = 120;
  
  if (nodes.length > 0) {
    // Find bounds of all nodes for scaling
    const minX = Math.min(...nodes.map(n => n.position.x));
    const maxX = Math.max(...nodes.map(n => n.position.x + 200));
    const minY = Math.min(...nodes.map(n => n.position.y));
    const maxY = Math.max(...nodes.map(n => n.position.y + 100));
    
    const diagramWidth = maxX - minX;
    const diagramHeight = maxY - minY;
    
    // Calculate scale to fit diagram in available space - MUCH LARGER
    const availableWidth = pageWidth - 2 * margin;
    const availableHeight = pageHeight - yPosition - margin - 10;
    const scale = Math.min(availableWidth / diagramWidth, availableHeight / diagramHeight, 2) * 0.9; // Increased from 0.7 to 0.9
    
    // Diagram title with background
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(margin, yPosition - 5, 120, 18, 3, 3, 'F');
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(51, 65, 85);
    pdf.text('Workflow Architecture', margin + 5, yPosition + 6);
    yPosition += 25;
    
    const diagramStartX = margin + (availableWidth - diagramWidth * scale) / 2;
    const diagramStartY = yPosition;
    
    // Draw enhanced connections with better styling
    pdf.setLineWidth(2);
    
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        const sourceX = diagramStartX + (sourceNode.position.x - minX + 100) * scale;
        const sourceY = diagramStartY + (sourceNode.position.y - minY + 50) * scale;
        const targetX = diagramStartX + (targetNode.position.x - minX + 100) * scale;
        const targetY = diagramStartY + (targetNode.position.y - minY + 50) * scale;
        
        // Connection line with gradient effect
        pdf.setDrawColor(99, 102, 241);
        pdf.setLineWidth(1.5);
        pdf.line(sourceX, sourceY, targetX, targetY);
        
        // Enhanced arrow head
        const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
        const arrowLength = 6;
        pdf.setFillColor(99, 102, 241);
        
        const arrowX1 = targetX - arrowLength * Math.cos(angle - 0.4);
        const arrowY1 = targetY - arrowLength * Math.sin(angle - 0.4);
        const arrowX2 = targetX - arrowLength * Math.cos(angle + 0.4);
        const arrowY2 = targetY - arrowLength * Math.sin(angle + 0.4);
        
        // Draw filled arrow
        pdf.triangle(targetX, targetY, arrowX1, arrowY1, arrowX2, arrowY2, 'F');
      }
    });
    
    // Draw enhanced nodes with better styling - MUCH LARGER
    nodes.forEach(node => {
      const x = diagramStartX + (node.position.x - minX) * scale;
      const y = diagramStartY + (node.position.y - minY) * scale;
      const width = 200 * scale; // Increased from 180
      const height = 100 * scale; // Increased from 80
      
      // Enhanced node colors with gradients
      const nodeColors = {
        dataSource: [59, 130, 246],     // Blue
        aiModel: [139, 92, 246],        // Purple
        database: [16, 185, 129],       // Green
        logic: [245, 158, 11],          // Orange
        output: [239, 68, 68],          // Red
        cloud: [6, 182, 212],           // Cyan
        compute: [249, 115, 22],        // Orange
        integration: [99, 102, 241],    // Indigo
      };
      
      const color = nodeColors[node.type as keyof typeof nodeColors] || [107, 114, 128];
      
      // Drop shadow effect
      pdf.setFillColor(0, 0, 0);
      pdf.setGState(pdf.GState({ opacity: 0.2 }));
      pdf.roundedRect(x + 3, y + 3, width, height, 8, 8, 'F');
      pdf.setGState(pdf.GState({ opacity: 1 }));
      
      // Main node background
      pdf.setFillColor(color[0], color[1], color[2]);
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(2);
      pdf.roundedRect(x, y, width, height, 8, 8, 'FD');
      
      // Node icon area (top section)
      pdf.setFillColor(255, 255, 255);
      pdf.setGState(pdf.GState({ opacity: 0.3 }));
      pdf.roundedRect(x + 8, y + 8, width - 16, height * 0.35, 4, 4, 'F');
      pdf.setGState(pdf.GState({ opacity: 1 }));
      
      // Node text styling - LARGER TEXT
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(Math.max(10, 12 * scale)); // Increased minimum size
      pdf.setFont('helvetica', 'bold');
      
      const label = (node.data?.label || node.type || 'Node') as string;
      const maxTextWidth = width - 20;
      const truncatedLabel = pdf.getTextWidth(label) > maxTextWidth ? 
        label.substring(0, Math.floor(label.length * maxTextWidth / pdf.getTextWidth(label))) + '...' : 
        label;
      
      const textWidth = pdf.getTextWidth(truncatedLabel);
      const textX = x + (width - textWidth) / 2;
      const textY = y + height * 0.55;
      
      pdf.text(truncatedLabel, textX, textY);
      
      // Node subtype/provider with smaller font
      if (node.data?.subtype || node.data?.provider) {
        pdf.setFontSize(Math.max(8, 9 * scale)); // Increased minimum size
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(255, 255, 255);
        pdf.setGState(pdf.GState({ opacity: 0.9 }));
        const subtext = (node.data?.provider || node.data?.subtype || '') as string;
        const maxSubtextWidth = width - 20;
        const truncatedSubtext = pdf.getTextWidth(subtext) > maxSubtextWidth ? 
          subtext.substring(0, Math.floor(subtext.length * maxSubtextWidth / pdf.getTextWidth(subtext))) + '...' : 
          subtext;
        
        const subtextWidth = pdf.getTextWidth(truncatedSubtext);
        const subtextX = x + (width - subtextWidth) / 2;
        pdf.text(truncatedSubtext, subtextX, textY + 10 * scale);
        pdf.setGState(pdf.GState({ opacity: 1 }));
      }
    });
  }
  
  // Add new page for detailed components
  pdf.addPage();
  
  // Enhanced components details page
  pdf.setFillColor(59, 130, 246);
  pdf.rect(0, 0, pageWidth, 35, 'F');
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('Component Details', margin, 22);
  
  yPosition = 50;
  
  nodes.forEach((node, index) => {
    // Check if we need a new page - better spacing
    const estimatedHeight = 60 + 
      (node.data?.description ? 25 : 0) + 
      (node.data?.config ? Object.keys(node.data.config).length * 8 : 0);
    
    if (yPosition + estimatedHeight > pageHeight - 30) {
      pdf.addPage();
      yPosition = 30;
    }
    
    // Component card background - Better spacing
    const cardHeight = Math.max(45, estimatedHeight);
    
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(margin, yPosition - 5, pageWidth - 2 * margin, cardHeight, 5, 5, 'F');
    
    // Component header with colored accent
    const nodeColors = {
      dataSource: [59, 130, 246],
      aiModel: [139, 92, 246],
      database: [16, 185, 129],
      logic: [245, 158, 11],
      output: [239, 68, 68],
      cloud: [6, 182, 212],
      compute: [249, 115, 22],
      integration: [99, 102, 241],
    };
    
    const color = nodeColors[node.type as keyof typeof nodeColors] || [107, 114, 128];
    pdf.setFillColor(color[0], color[1], color[2]);
    pdf.roundedRect(margin + 5, yPosition, 6, 12, 2, 2, 'F');
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(51, 65, 85);
    const componentLabel = (node.data?.label || node.type || 'Component') as string;
    pdf.text(`${index + 1}. ${componentLabel}`, margin + 18, yPosition + 8);
    yPosition += 18;
    
    // Component metadata - Better layout
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    
    let metaY = yPosition;
    pdf.text(`Type: ${node.type}`, margin + 18, metaY);
    
    if (node.data?.subtype) {
      pdf.text(`Subtype: ${String(node.data.subtype)}`, margin + 110, metaY);
    }
    metaY += 10;
    
    if (node.data?.provider) {
      pdf.text(`Provider: ${String(node.data.provider)}`, margin + 18, metaY);
      metaY += 10;
    }

    // Enhanced description section - Better spacing
    if (node.data?.description) {
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(51, 65, 85);
      pdf.text('Description:', margin + 18, metaY);
      metaY += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(71, 85, 105);
      
      const description = String(node.data.description);
      const maxLineWidth = pageWidth - margin * 2 - 35;
      const lines = pdf.splitTextToSize(description, maxLineWidth);
      
      lines.forEach((line: string) => {
        if (metaY > pageHeight - 25) {
          pdf.addPage();
          metaY = 30;
        }
        pdf.text(line, margin + 22, metaY);
        metaY += 7;
      });
      
      metaY += 8;
    }
    
    // Configuration details - Better formatting to prevent overlap
    if (node.data?.config && Object.keys(node.data.config).length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(51, 65, 85);
      pdf.text('Configuration:', margin + 18, metaY);
      metaY += 10;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 116, 139);
      
      const configEntries = Object.entries(node.data.config);
      const maxConfigWidth = pageWidth - margin * 2 - 40;
      
      configEntries.forEach(([key, value]) => {
        if (metaY > pageHeight - 20) {
          pdf.addPage();
          metaY = 30;
        }
        
        let configText = '';
        if (typeof value === 'object' && value !== null) {
          // Better formatting for objects
          const objStr = JSON.stringify(value, null, 2);
          if (objStr.length > 100) {
            configText = `• ${key}: [Complex Object]`;
          } else {
            configText = `• ${key}: ${JSON.stringify(value)}`;
          }
        } else {
          configText = `• ${key}: ${String(value)}`;
        }
        
        // Split long configuration lines to prevent overlap
        const configLines = pdf.splitTextToSize(configText, maxConfigWidth);
        configLines.forEach((line: string) => {
          if (metaY > pageHeight - 20) {
            pdf.addPage();
            metaY = 30;
          }
          pdf.text(line, margin + 22, metaY);
          metaY += 7;
        });
      });
    }
    
    yPosition = metaY + 20; // Better spacing between components
  });
  
  // Save the PDF
  const fileName = `${workflowName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_workflow.pdf`;
  pdf.save(fileName);
};
