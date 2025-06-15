
import DataSourceNode from './DataSourceNode';
import LogicNode from './LogicNode';
import OutputNode from './OutputNode';
import AIModelNode from './AIModelNode';
import ComputeNode from './ComputeNode';

export const nodeTypes = {
  dataSource: DataSourceNode,
  logic: LogicNode,
  output: OutputNode,
  aiModel: AIModelNode,
  compute: ComputeNode,
  cloud: DataSourceNode, // Using DataSourceNode as fallback for cloud type
  database: DataSourceNode, // Using DataSourceNode as fallback for database type
  integration: LogicNode, // Using LogicNode as fallback for integration type
};
