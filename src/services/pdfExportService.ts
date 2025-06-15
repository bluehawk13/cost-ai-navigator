
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
  const margin = 20;
  
  // Enhanced header design
  pdf.setFillColor(59, 130, 246);
  pdf.rect(0, 0, pageWidth, 50, 'F');
  
  // Title with white text
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text(workflowName, margin, 30);
  
  // Subtitle with light blue background
  pdf.setFillColor(239, 246, 255);
  pdf.rect(0, 50, pageWidth, 25, 'F');
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(59, 130, 246);
  pdf.text(`AI Workflow Diagram • Generated on ${new Date().toLocaleDateString()}`, margin, 65);
  
  // Summary section with improved styling
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Workflow Overview', margin, 90);
  
  // Summary cards
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(margin, 95, 80, 25, 3, 3, 'F');
  pdf.roundedRect(margin + 90, 95, 80, 25, 3, 3, 'F');
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(71, 85, 105);
  pdf.text('Components', margin + 5, 105);
  pdf.text('Connections', margin + 95, 105);
  
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(59, 130, 246);
  pdf.text(nodes.length.toString(), margin + 5, 115);
  pdf.text(edges.length.toString(), margin + 95, 115);
  
  // Enhanced Visual Diagram Section
  let yPosition = 140;
  
  if (nodes.length > 0) {
    // Find bounds of all nodes for scaling
    const minX = Math.min(...nodes.map(n => n.position.x));
    const maxX = Math.max(...nodes.map(n => n.position.x + 180)); // Increased node width
    const minY = Math.min(...nodes.map(n => n.position.y));
    const maxY = Math.max(...nodes.map(n => n.position.y + 80)); // Increased node height
    
    const diagramWidth = maxX - minX;
    const diagramHeight = maxY - minY;
    
    // Calculate scale to fit diagram in available space
    const availableWidth = pageWidth - 2 * margin;
    const availableHeight = pageHeight - yPosition - margin - 20;
    const scale = Math.min(availableWidth / diagramWidth, availableHeight / diagramHeight, 1) * 0.7;
    
    // Diagram title with background
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(margin, yPosition - 5, 150, 20, 3, 3, 'F');
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(51, 65, 85);
    pdf.text('Workflow Architecture', margin + 5, yPosition + 7);
    yPosition += 25;
    
    const diagramStartX = margin + (availableWidth - diagramWidth * scale) / 2;
    const diagramStartY = yPosition;
    
    // Draw enhanced connections with better styling
    pdf.setLineWidth(2);
    
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        const sourceX = diagramStartX + (sourceNode.position.x - minX + 90) * scale;
        const sourceY = diagramStartY + (sourceNode.position.y - minY + 40) * scale;
        const targetX = diagramStartX + (targetNode.position.x - minX + 90) * scale;
        const targetY = diagramStartY + (targetNode.position.y - minY + 40) * scale;
        
        // Connection line with gradient effect
        pdf.setDrawColor(156, 163, 175);
        pdf.line(sourceX, sourceY, targetX, targetY);
        
        // Enhanced arrow head
        const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
        const arrowLength = 5;
        pdf.setFillColor(156, 163, 175);
        
        const arrowX1 = targetX - arrowLength * Math.cos(angle - 0.5);
        const arrowY1 = targetY - arrowLength * Math.sin(angle - 0.5);
        const arrowX2 = targetX - arrowLength * Math.cos(angle + 0.5);
        const arrowY2 = targetY - arrowLength * Math.sin(angle + 0.5);
        
        // Draw filled arrow
        pdf.triangle(targetX, targetY, arrowX1, arrowY1, arrowX2, arrowY2, 'F');
      }
    });
    
    // Draw enhanced nodes with better styling
    nodes.forEach(node => {
      const x = diagramStartX + (node.position.x - minX) * scale;
      const y = diagramStartY + (node.position.y - minY) * scale;
      const width = 180 * scale;
      const height = 80 * scale;
      
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
      pdf.setFillColor(0, 0, 0, 0.1);
      pdf.roundedRect(x + 2, y + 2, width, height, 6, 6, 'F');
      
      // Main node background
      pdf.setFillColor(color[0], color[1], color[2]);
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(1);
      pdf.roundedRect(x, y, width, height, 6, 6, 'FD');
      
      // Node icon area (top section)
      pdf.setFillColor(255, 255, 255, 0.2);
      pdf.roundedRect(x + 5, y + 5, width - 10, height * 0.4, 3, 3, 'F');
      
      // Node text styling
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(Math.max(8, 10 * scale));
      pdf.setFont('helvetica', 'bold');
      
      const label = (node.data?.label || node.type || 'Node') as string;
      const textWidth = pdf.getTextWidth(label);
      const textX = x + (width - textWidth) / 2;
      const textY = y + height * 0.6;
      
      pdf.text(label, textX, textY);
      
      // Node subtype/provider with smaller font
      if (node.data?.subtype || node.data?.provider) {
        pdf.setFontSize(Math.max(6, 7 * scale));
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(255, 255, 255, 0.8);
        const subtext = (node.data?.provider || node.data?.subtype || '') as string;
        const subtextWidth = pdf.getTextWidth(subtext);
        const subtextX = x + (width - subtextWidth) / 2;
        pdf.text(subtext, subtextX, textY + 8 * scale);
      }
    });
  }
  
  // Add new page for detailed components
  pdf.addPage();
  
  // Enhanced components details page
  pdf.setFillColor(59, 130, 246);
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('Component Details', margin, 25);
  
  yPosition = 60;
  
  nodes.forEach((node, index) => {
    if (yPosition > pageHeight - 100) {
      pdf.addPage();
      yPosition = 30;
    }
    
    // Component card background
    const cardHeight = node.data?.description ? 
      (node.data.config && Object.keys(node.data.config).length > 0 ? 80 : 60) : 
      (node.data.config && Object.keys(node.data.config).length > 0 ? 65 : 45);
    
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
    pdf.roundedRect(margin + 5, yPosition, 8, 15, 2, 2, 'F');
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(51, 65, 85);
    const componentLabel = (node.data?.label || node.type || 'Component') as string;
    pdf.text(`${index + 1}. ${componentLabel}`, margin + 20, yPosition + 10);
    yPosition += 20;
    
    // Component metadata
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    
    let metaY = yPosition;
    pdf.text(`Type: ${node.type}`, margin + 20, metaY);
    
    if (node.data?.subtype) {
      pdf.text(`Subtype: ${String(node.data.subtype)}`, margin + 120, metaY);
    }
    metaY += 8;
    
    if (node.data?.provider) {
      pdf.text(`Provider: ${String(node.data.provider)}`, margin + 20, metaY);
      metaY += 8;
    }

    // Enhanced description section
    if (node.data?.description) {
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(51, 65, 85);
      pdf.text('Description:', margin + 20, metaY);
      metaY += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(71, 85, 105);
      
      const description = String(node.data.description);
      const maxLineWidth = pageWidth - margin * 2 - 40;
      const lines = pdf.splitTextToSize(description, maxLineWidth);
      
      lines.forEach((line: string) => {
        if (metaY > pageHeight - 30) {
          pdf.addPage();
          metaY = 30;
        }
        pdf.text(line, margin + 25, metaY);
        metaY += 6;
      });
      
      metaY += 5;
    }
    
    // Configuration details in a more organized format
    if (node.data?.config && Object.keys(node.data.config).length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(51, 65, 85);
      pdf.text('Configuration:', margin + 20, metaY);
      metaY += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 116, 139);
      
      Object.entries(node.data.config).forEach(([key, value]) => {
        if (metaY > pageHeight - 25) {
          pdf.addPage();
          metaY = 30;
        }
        
        if (typeof value === 'object' && value !== null) {
          pdf.text(`• ${key}: ${JSON.stringify(value)}`, margin + 25, metaY);
        } else {
          pdf.text(`• ${key}: ${String(value)}`, margin + 25, metaY);
        }
        metaY += 6;
      });
    }
    
    yPosition = metaY + 15;
  });
  
  // Save the PDF
  const fileName = `${workflowName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_workflow.pdf`;
  pdf.save(fileName);
};
