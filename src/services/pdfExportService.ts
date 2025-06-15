
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
  
  // Enhanced Visual Diagram Section - Maximum Size
  let yPosition = 120;
  
  if (nodes.length > 0) {
    // Find bounds of all nodes for scaling
    const minX = Math.min(...nodes.map(n => n.position.x));
    const maxX = Math.max(...nodes.map(n => n.position.x + 300)); // Increased node width consideration
    const minY = Math.min(...nodes.map(n => n.position.y));
    const maxY = Math.max(...nodes.map(n => n.position.y + 120)); // Increased node height consideration
    
    const diagramWidth = maxX - minX;
    const diagramHeight = maxY - minY;
    
    // Calculate scale to fit diagram in available space - MAXIMUM SIZE
    const availableWidth = pageWidth - 2 * margin;
    const availableHeight = pageHeight - yPosition - margin - 10;
    const scale = Math.min(availableWidth / diagramWidth, availableHeight / diagramHeight, 3) * 0.95; // Increased max scale
    
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
        const sourceX = diagramStartX + (sourceNode.position.x - minX + 150) * scale; // Adjusted for larger nodes
        const sourceY = diagramStartY + (sourceNode.position.y - minY + 60) * scale;
        const targetX = diagramStartX + (targetNode.position.x - minX + 150) * scale;
        const targetY = diagramStartY + (targetNode.position.y - minY + 60) * scale;
        
        // Connection line with gradient effect
        pdf.setDrawColor(99, 102, 241);
        pdf.setLineWidth(2);
        pdf.line(sourceX, sourceY, targetX, targetY);
        
        // Enhanced arrow head
        const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
        const arrowLength = 8;
        pdf.setFillColor(99, 102, 241);
        
        const arrowX1 = targetX - arrowLength * Math.cos(angle - 0.4);
        const arrowY1 = targetY - arrowLength * Math.sin(angle - 0.4);
        const arrowX2 = targetX - arrowLength * Math.cos(angle + 0.4);
        const arrowY2 = targetY - arrowLength * Math.sin(angle + 0.4);
        
        // Draw filled arrow
        pdf.triangle(targetX, targetY, arrowX1, arrowY1, arrowX2, arrowY2, 'F');
      }
    });
    
    // Draw enhanced nodes with MAXIMUM size and PROMINENT labels
    nodes.forEach(node => {
      const x = diagramStartX + (node.position.x - minX) * scale;
      const y = diagramStartY + (node.position.y - minY) * scale;
      const width = 300 * scale; // Significantly increased
      const height = 120 * scale; // Significantly increased
      
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
      pdf.setGState(pdf.GState({ opacity: 0.15 }));
      pdf.roundedRect(x + 4, y + 4, width, height, 10, 10, 'F');
      pdf.setGState(pdf.GState({ opacity: 1 }));
      
      // Main node background with border
      pdf.setFillColor(color[0], color[1], color[2]);
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(3);
      pdf.roundedRect(x, y, width, height, 10, 10, 'FD');
      
      // White label background area for better text visibility
      pdf.setFillColor(255, 255, 255);
      pdf.setGState(pdf.GState({ opacity: 0.95 }));
      pdf.roundedRect(x + 8, y + height * 0.25, width - 16, height * 0.5, 6, 6, 'F');
      pdf.setGState(pdf.GState({ opacity: 1 }));
      
      // PROMINENT Node Label - MAIN TEXT
      const label = (node.data?.label || node.type || 'Node') as string;
      const maxLabelWidth = width - 24;
      
      // Calculate appropriate font size based on scale and text length
      let labelFontSize = Math.max(14, Math.min(18, 16 * scale));
      if (label.length > 15) labelFontSize = Math.max(12, Math.min(16, 14 * scale));
      if (label.length > 25) labelFontSize = Math.max(10, Math.min(14, 12 * scale));
      
      pdf.setFontSize(labelFontSize);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(51, 65, 85); // Dark text for better readability
      
      // Smart text truncation and wrapping
      let displayLabel = label;
      if (pdf.getTextWidth(label) > maxLabelWidth) {
        const words = label.split(' ');
        if (words.length > 1) {
          // Try to fit on two lines
          const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(' ');
          const secondLine = words.slice(Math.ceil(words.length / 2)).join(' ');
          
          if (pdf.getTextWidth(firstLine) <= maxLabelWidth && pdf.getTextWidth(secondLine) <= maxLabelWidth) {
            // Draw two lines
            const firstLineWidth = pdf.getTextWidth(firstLine);
            const secondLineWidth = pdf.getTextWidth(secondLine);
            const firstLineX = x + (width - firstLineWidth) / 2;
            const secondLineX = x + (width - secondLineWidth) / 2;
            const centerY = y + height * 0.45;
            
            pdf.text(firstLine, firstLineX, centerY);
            pdf.text(secondLine, secondLineX, centerY + labelFontSize * 0.35);
          } else {
            // Single line with truncation
            displayLabel = label.substring(0, Math.floor(label.length * maxLabelWidth / pdf.getTextWidth(label)) - 3) + '...';
            const textWidth = pdf.getTextWidth(displayLabel);
            const textX = x + (width - textWidth) / 2;
            pdf.text(displayLabel, textX, y + height * 0.5);
          }
        } else {
          // Single word truncation
          displayLabel = label.substring(0, Math.floor(label.length * maxLabelWidth / pdf.getTextWidth(label)) - 3) + '...';
          const textWidth = pdf.getTextWidth(displayLabel);
          const textX = x + (width - textWidth) / 2;
          pdf.text(displayLabel, textX, y + height * 0.5);
        }
      } else {
        // Label fits, center it
        const textWidth = pdf.getTextWidth(displayLabel);
        const textX = x + (width - textWidth) / 2;
        pdf.text(displayLabel, textX, y + height * 0.5);
      }
      
      // Node type/subtype label - SMALLER secondary text
      if (node.data?.subtype || node.data?.provider || node.type) {
        const subtypeFontSize = Math.max(8, Math.min(12, 10 * scale));
        pdf.setFontSize(subtypeFontSize);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 116, 139); // Lighter color for secondary text
        
        const subtext = (node.data?.provider || node.data?.subtype || node.type || '') as string;
        const maxSubtextWidth = width - 24;
        
        let displaySubtext = subtext;
        if (pdf.getTextWidth(subtext) > maxSubtextWidth) {
          displaySubtext = subtext.substring(0, Math.floor(subtext.length * maxSubtextWidth / pdf.getTextWidth(subtext)) - 3) + '...';
        }
        
        const subtextWidth = pdf.getTextWidth(displaySubtext);
        const subtextX = x + (width - subtextWidth) / 2;
        pdf.text(displaySubtext, subtextX, y + height * 0.75);
      }
      
      // Add node type indicator in corner
      pdf.setFillColor(color[0], color[1], color[2]);
      pdf.setGState(pdf.GState({ opacity: 0.8 }));
      pdf.roundedRect(x + width - 25, y + 5, 20, 15, 3, 3, 'F');
      pdf.setGState(pdf.GState({ opacity: 1 }));
      
      pdf.setFontSize(Math.max(6, 8 * scale));
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      const typeAbbr = node.type?.substring(0, 3).toUpperCase() || 'NOD';
      const typeWidth = pdf.getTextWidth(typeAbbr);
      pdf.text(typeAbbr, x + width - 15 - typeWidth/2, y + 14);
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
    const estimatedHeight = 70 + 
      (node.data?.description ? 30 : 0) + 
      (node.data?.config ? Math.min(Object.keys(node.data.config).length * 10, 80) : 0);
    
    if (yPosition + estimatedHeight > pageHeight - 30) {
      pdf.addPage();
      yPosition = 30;
    }
    
    // Component card background - Better spacing
    const cardHeight = Math.max(55, estimatedHeight);
    
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
    pdf.roundedRect(margin + 5, yPosition, 6, 15, 2, 2, 'F');
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(51, 65, 85);
    const componentLabel = (node.data?.label || node.type || 'Component') as string;
    pdf.text(`${index + 1}. ${componentLabel}`, margin + 18, yPosition + 10);
    yPosition += 20;
    
    // Component metadata - Better layout
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    
    let metaY = yPosition;
    pdf.text(`Type: ${node.type}`, margin + 18, metaY);
    
    if (node.data?.subtype) {
      pdf.text(`Subtype: ${String(node.data.subtype)}`, margin + 110, metaY);
    }
    metaY += 12;
    
    if (node.data?.provider) {
      pdf.text(`Provider: ${String(node.data.provider)}`, margin + 18, metaY);
      metaY += 12;
    }

    // Enhanced description section - Better spacing
    if (node.data?.description) {
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(51, 65, 85);
      pdf.text('Description:', margin + 18, metaY);
      metaY += 10;
      
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
        metaY += 8;
      });
      
      metaY += 10;
    }
    
    // Configuration details - Better formatting with proper spacing
    if (node.data?.config && Object.keys(node.data.config).length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(51, 65, 85);
      pdf.text('Configuration:', margin + 18, metaY);
      metaY += 12;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 116, 139);
      
      const configEntries = Object.entries(node.data.config);
      const maxConfigWidth = pageWidth - margin * 2 - 40;
      
      configEntries.forEach(([key, value]) => {
        if (metaY > pageHeight - 25) {
          pdf.addPage();
          metaY = 35;
        }
        
        let configText = '';
        if (typeof value === 'object' && value !== null) {
          const objStr = JSON.stringify(value, null, 2);
          if (objStr.length > 120) {
            configText = `• ${key}: [Complex Object - ${Object.keys(value).length} properties]`;
          } else {
            configText = `• ${key}: ${JSON.stringify(value)}`;
          }
        } else if (typeof value === 'string' && value.length > 80) {
          configText = `• ${key}: ${value.substring(0, 77)}...`;
        } else {
          configText = `• ${key}: ${String(value)}`;
        }
        
        // Better line handling with increased spacing
        const configLines = pdf.splitTextToSize(configText, maxConfigWidth);
        configLines.forEach((line: string, lineIndex: number) => {
          if (metaY > pageHeight - 25) {
            pdf.addPage();
            metaY = 35;
          }
          pdf.text(line, margin + 22, metaY);
          metaY += 9; // Increased line spacing
        });
        
        metaY += 3; // Extra space between config items
      });
    }
    
    yPosition = metaY + 25; // Better spacing between components
  });
  
  // Save the PDF
  const fileName = `${workflowName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_workflow.pdf`;
  pdf.save(fileName);
};
