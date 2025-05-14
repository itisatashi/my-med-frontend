import React, { useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
// Import specific functions from D3 to avoid TypeScript errors
import { select } from 'd3-selection';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';
import { drag } from 'd3-drag';

interface NetworkNode {
  id: string;
  group: number;
  size: number;
  label: string;
}

// Extended type for nodes with simulation properties
interface SimulationNode extends NetworkNode {
  x: number;
  y: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
  index?: number;
}

interface NetworkLink {
  source: string | SimulationNode;
  target: string | SimulationNode;
  value: number;
}

interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

/**
 * Component for displaying interactive symptom network visualization
 */
const SymptomNetwork: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Sample data - in a real application, this would come from backend analysis
    const data: NetworkData = {
          nodes: [
            { id: "головная боль", group: 1, size: 25, label: "Головная боль" },
            { id: "тошнота", group: 1, size: 15, label: "Тошнота" },
            { id: "слабость", group: 2, size: 20, label: "Слабость" },
            { id: "усталость", group: 2, size: 18, label: "Усталость" },
            { id: "зубная боль", group: 3, size: 22, label: "Зубная боль" },
            { id: "повышенная температура", group: 4, size: 23, label: "Температура" },
            { id: "боль в горле", group: 4, size: 15, label: "Боль в горле" },
            { id: "насморк", group: 4, size: 12, label: "Насморк" },
            { id: "кашель", group: 4, size: 14, label: "Кашель" },
            { id: "боль в спине", group: 5, size: 18, label: "Боль в спине" },
            { id: "боль в суставах", group: 5, size: 15, label: "Боль в суставах" },
          ],
          links: [
            { source: "головная боль", target: "тошнота", value: 8 },
            { source: "головная боль", target: "слабость", value: 10 },
            { source: "головная боль", target: "повышенная температура", value: 6 },
            { source: "тошнота", target: "слабость", value: 5 },
            { source: "слабость", target: "усталость", value: 12 },
            { source: "повышенная температура", target: "боль в горле", value: 8 },
            { source: "повышенная температура", target: "насморк", value: 7 },
            { source: "боль в горле", target: "насморк", value: 9 },
            { source: "насморк", target: "кашель", value: 11 },
            { source: "боль в спине", target: "боль в суставах", value: 7 },
            { source: "слабость", target: "боль в спине", value: 4 },
          ]
        };

    // D3 visualization setup
    const setupVisualization = () => {
      if (!containerRef.current) return;
      
      // Clear any existing SVG
      select(containerRef.current).select("svg").remove();
      
      const width = containerRef.current.clientWidth;
      const height = 450;
      
      // Create SVG
      const svg = select(containerRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto;");
      
      svgRef.current = svg.node();
      
      // Define color scale based on group
      const color = scaleOrdinal(schemeCategory10);
      
      // Create force simulation
      const simulation = forceSimulation(data.nodes as any)
        .force("link", forceLink(data.links as any).id((d: any) => d.id).distance(100))
        .force("charge", forceManyBody().strength(-300))
        .force("center", forceCenter(0, 0))
        .force("collide", forceCollide().radius((d: any) => d.size + 10));
          
          // Create links
          const link = svg.append("g")
            .selectAll("line")
            .data(data.links)
            .join("line")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", (d: NetworkLink) => Math.sqrt(d.value));
          
      // Create node groups
      const node = svg.append("g")
        .selectAll<SVGGElement, SimulationNode>(".node")
        .data(data.nodes as SimulationNode[])
        .join("g")
        .attr("class", "node")
        .call(drag<SVGGElement, SimulationNode>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));
          
          // Add circles to nodes
          node.append("circle")
            .attr("r", (d: SimulationNode) => d.size / 2)
            .attr("fill", (d: SimulationNode) => color(d.group.toString()) as string)
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5);
          
          // Add labels to nodes
          node.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("font-size", "10px")
            .attr("font-weight", "bold")
            .text((d: SimulationNode) => d.label)
            .attr("fill", "#615f5b")
            .attr("pointer-events", "none");
          
          // Add title for tooltip
          node.append("title")
            .text((d: SimulationNode) => d.label);
          
          // Update function for simulation
          simulation.on("tick", () => {
            link
              .attr("x1", (d: any) => d.source.x)
              .attr("y1", (d: any) => d.source.y)
              .attr("x2", (d: any) => d.target.x)
              .attr("y2", (d: any) => d.target.y);
            
            node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
          });
          
          // Drag functions
          function dragstarted(event: any, d: SimulationNode) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          }
          
          function dragged(event: any, d: SimulationNode) {
            d.fx = event.x;
            d.fy = event.y;
          }
          
          function dragended(event: any, d: SimulationNode) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }
        };
    
    // Initial setup
    setupVisualization();
    
    // Handle window resize
    const handleResize = () => {
      setupVisualization();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Сеть взаимосвязей симптомов
        </Typography>
        <Tooltip title="Интерактивная визуализация связей между вашими симптомами. Размер узла показывает частоту симптома, а толщина линии - силу связи">
          <InfoOutlined fontSize="small" color="action" />
        </Tooltip>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Перетащите узлы, чтобы исследовать связи между симптомами. Наведите курсор для подробностей.
      </Typography>
      
      <Box 
        ref={containerRef} 
        sx={{ 
          width: '100%',
          height: 450,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        {!svgRef.current && (
          <CircularProgress sx={{ position: 'absolute' }} />
        )}
      </Box>
    </Paper>
  );
};

export default SymptomNetwork;
