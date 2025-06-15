
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
  
  // Title
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(59, 130, 246);
  pdf.text(workflowName, margin, 30);
  
  // Subtitle
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 40);
  
  // Workflow Summary
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Workflow Summary', margin, 55);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Total Components: ${nodes.length}`, margin, 65);
  pdf.text(`Total Connections: ${edges.length}`, margin, 72);
  
  // Visual Diagram Section
  let yPosition = 90;
  
  if (nodes.length > 0) {
    // Find bounds of all nodes for scaling
    const minX = Math.min(...nodes.map(n => n.position.x));
    const maxX = Math.max(...nodes.map(n => n.position.x + 150)); // Assuming 150px node width
    const minY = Math.min(...nodes.map(n => n.position.y));
    const maxY = Math.max(...nodes.map(n => n.position.y + 60)); // Assuming 60px node height
    
    const diagramWidth = maxX - minX;
    const diagramHeight = maxY - minY;
    
    // Calculate scale to fit diagram in available space
    const availableWidth = pageWidth - 2 * margin;
    const availableHeight = pageHeight - yPosition - margin;
    const scale = Math.min(availableWidth / diagramWidth, availableHeight / diagramHeight, 1) * 0.8;
    
    // Draw workflow diagram
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Workflow Diagram', margin, yPosition);
    yPosition += 15;
    
    const diagramStartX = margin + (availableWidth - diagramWidth * scale) / 2;
    const diagramStartY = yPosition;
    
    // Draw connections first (so they appear behind nodes)
    pdf.setDrawColor(156, 163, 175);
    pdf.setLineWidth(0.5);
    
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        const sourceX = diagramStartX + (sourceNode.position.x - minX + 75) * scale;
        const sourceY = diagramStartY + (sourceNode.position.y - minY + 30) * scale;
        const targetX = diagramStartX + (targetNode.position.x - minX + 75) * scale;
        const targetY = diagramStartY + (targetNode.position.y - minY + 30) * scale;
        
        pdf.line(sourceX, sourceY, targetX, targetY);
        
        // Draw arrow head
        const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
        const arrowLength = 3;
        pdf.line(
          targetX,
          targetY,
          targetX - arrowLength * Math.cos(angle - 0.5),
          targetY - arrowLength * Math.sin(angle - 0.5)
        );
        pdf.line(
          targetX,
          targetY,
          targetX - arrowLength * Math.cos(angle + 0.5),
          targetY - arrowLength * Math.sin(angle + 0.5)
        );
      }
    });
    
    // Draw nodes
    nodes.forEach(node => {
      const x = diagramStartX + (node.position.x - minX) * scale;
      const y = diagramStartY + (node.position.y - minY) * scale;
      const width = 150 * scale;
      const height = 60 * scale;
      
      // Node background color based on type
      const nodeColors = {
        dataSource: [59, 130, 246],    // Blue
        aiModel: [139, 92, 246],       // Purple
        database: [16, 185, 129],      // Green
        logic: [245, 158, 11],         // Orange
        output: [239, 68, 68],         // Red
        cloud: [6, 182, 212],          // Cyan
        compute: [249, 115, 22],       // Orange
        integration: [99, 102, 241],   // Indigo
      };
      
      const color = nodeColors[node.type as keyof typeof nodeColors] || [107, 114, 128];
      pdf.setFillColor(color[0], color[1], color[2]);
      pdf.setDrawColor(229, 231, 235);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(x, y, width, height, 3, 3, 'FD');
      
      // Node text
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      
      const label = node.data?.label || node.type || 'Node';
      const textWidth = pdf.getTextWidth(label);
      const textX = x + (width - textWidth) / 2;
      const textY = y + height / 2 - 5;
      
      pdf.text(label, textX, textY);
      
      // Node subtype/provider
      if (node.data?.subtype || node.data?.provider) {
        pdf.setFontSize(6);
        pdf.setFont('helvetica', 'normal');
        const subtext = node.data?.provider || node.data?.subtype || '';
        const subtextWidth = pdf.getTextWidth(subtext);
        const subtextX = x + (width - subtextWidth) / 2;
        pdf.text(subtext, subtextX, textY + 8);
      }
    });
  }
  
  // Add new page for components details
  pdf.addPage();
  
  // Components Details
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(59, 130, 246);
  pdf.text('Component Details', margin, 30);
  
  yPosition = 45;
  
  nodes.forEach((node, index) => {
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 30;
    }
    
    // Component header
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${index + 1}. ${node.data?.label || node.type || 'Component'}`, margin, yPosition);
    yPosition += 8;
    
    // Component details
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    
    pdf.text(`Type: ${node.type}`, margin + 5, yPosition);
    yPosition += 6;
    
    if (node.data?.subtype) {
      pdf.text(`Subtype: ${node.data.subtype}`, margin + 5, yPosition);
      yPosition += 6;
    }
    
    if (node.data?.provider) {
      pdf.text(`Provider: ${node.data.provider}`, margin + 5, yPosition);
      yPosition += 6;
    }
    
    // Configuration details
    if (node.data?.config && Object.keys(node.data.config).length > 0) {
      pdf.text('Configuration:', margin + 5, yPosition);
      yPosition += 6;
      
      Object.entries(node.data.config).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          pdf.text(`  ${key}: ${JSON.stringify(value)}`, margin + 10, yPosition);
        } else {
          pdf.text(`  ${key}: ${String(value)}`, margin + 10, yPosition);
        }
        yPosition += 5;
      });
    }
    
    yPosition += 5; // Space between components
  });
  
  // Save the PDF
  const fileName = `${workflowName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_workflow.pdf`;
  pdf.save(fileName);
};
