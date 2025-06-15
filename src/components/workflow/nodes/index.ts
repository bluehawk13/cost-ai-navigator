
import DataSourceNode from './DataSourceNode';
import AIModelNode from './AIModelNode';
import DatabaseNode from './DatabaseNode';
import ComputeNode from './ComputeNode';
import IntegrationNode from './IntegrationNode';
import LogicNode from './LogicNode';
import OutputNode from './OutputNode';
import CloudProviderNode from './CloudProviderNode';

export const nodeTypes = {
  datasource: DataSourceNode,
  aimodel: AIModelNode,
  database: DatabaseNode,
  compute: ComputeNode,
  integration: IntegrationNode,
  logic: LogicNode,
  output: OutputNode,
  cloudprovider: CloudProviderNode,
};

export {
  DataSourceNode,
  AIModelNode,
  DatabaseNode,
  ComputeNode,
  IntegrationNode,
  LogicNode,
  OutputNode,
  CloudProviderNode,
};
