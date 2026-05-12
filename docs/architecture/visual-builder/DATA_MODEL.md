# Visual Builder Data Model Specification

## 1. Node Schema
Nodes are the atomic units of the visual builder.

```json
{
  "id": "uuid",
  "type": "string",
  "position": { "x": "number", "y": "number" },
  "data": "object",
  "ports": {
    "inputs": ["portId"],
    "outputs": ["portId"]
  },
  "metadata": {
    "version": "string",
    "created_at": "timestamp",
    "last_updated": "timestamp"
  }
}
```

## 2. Edge (Connection) Schema
Edges define the relationship and flow between nodes.

```json
{
  "id": "uuid",
  "source": "nodeId",
  "source_port": "portId",
  "target": "nodeId",
  "target_port": "portId",
  "type": "string",
  "metadata": "object"
}
```

## 3. Graph Container
A graph is a collection of nodes and edges.

```json
{
  "id": "uuid",
  "name": "string",
  "nodes": ["Node"],
  "edges": ["Edge"],
  "viewport": {
    "x": "number",
    "y": "number",
    "zoom": "number"
  }
}
```

## 4. Persistence Layer (Neon)
The data is stored in a relational schema in Neon PostgreSQL.

### Tables
- `vb_graphs`: High-level graph metadata.
- `vb_nodes`: Individual nodes with JSONB for data.
- `vb_edges`: Relationships with foreign keys to nodes.
- `vb_assets`: Linked media and assets.

### Indexing
- B-Tree on `graph_id` for quick loading.
- GiST index on `position` for spatial queries.
