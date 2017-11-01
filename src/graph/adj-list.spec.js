import { AdjacencyList } from './adj-list';

describe('Adjacency List', () => {
  let adjList;
  beforeEach(() => {
    adjList = new AdjacencyList(true);
  });

  it('should create adjacency list object', () => {
    expect(adjList).toBeDefined();
    expect(adjList.edges).toBeDefined();
  });

  it('should have empty edges when adjacency list object is created', () => {
    expect(adjList.edges.size).toBe(0);
  });

  it('should add node through addNode method', () => {
    expect(adjList.edges.size).toBe(0);

    adjList.addNode('A');
    expect(adjList.edges.size).toBe(1);
    expect(adjList.edges.get('A').len).toBe(0);

    adjList.addNode('B');
    expect(adjList.edges.size).toBe(2);
    expect(adjList.edges.get('B').len).toBe(0);
  });

  it('should delete the node from the map', () => {
    expect(adjList.edges.size).toBe(0);

    adjList.addNode('A');
    expect(adjList.edges.size).toBe(1);

    adjList.removeNode('A');
    expect(adjList.edges.size).toBe(0);
    expect(adjList.edges.has('A')).toBeFalsy();
  });

  describe('Insert Operation', () => {
    let unDirectedGraph;
    beforeEach(() => {
      unDirectedGraph = new AdjacencyList(false);

      adjList.addNode('A');
      adjList.addNode('B');
    });

    it('should add an edge of weight 20 between A and B', () => {
      adjList.addEdge('A', 'B', 200);
      const vertexA = adjList.edges.get('A');
      expect(vertexA.len).toBe(1);

      const lookupB = vertexA.lookup('B');
      expect(lookupB.hasVal).toBeTruthy();
      expect(lookupB.currentNode.details.weight).toBe(200);
    });
    it('should add edge between B and C', () => {
      expect(adjList.edges.size).toBe(2);

      adjList.addEdge('B', 'C');
      expect(adjList.edges.size).toBe(3);
      const vertexB = adjList.edges.get('B');
      expect(vertexB.len).toBe(1);

      const lookupC = vertexB.lookup('C');
      expect(lookupC.hasVal).toBeTruthy();
      expect(lookupC.currentNode.details.weight).toBe(undefined);
    });
    it('should add edge A and B in undirected graph', () => {
      expect(unDirectedGraph.edges.size).toBe(0);

      unDirectedGraph.addEdge('A', 'B');
      expect(unDirectedGraph.edges.size).toBe(2);

      const vertexA = unDirectedGraph.edges.get('A');
      expect(vertexA.len).toBe(1);
      const lookupB = vertexA.lookup('B');
      expect(lookupB.hasVal).toBeTruthy();

      const vertexB = unDirectedGraph.edges.get('B');
      expect(vertexB.len).toBe(1);
      const lookupA = vertexB.lookup('A');
      expect(lookupA.hasVal).toBeTruthy();
    });
  });

  describe('Delete Edge Operation', () => {
    beforeEach(() => {
      adjList.addEdge('A', 'B');
      adjList.addEdge('A', 'C');
    });

    it('should delete edge A -> C', () => {
      expect(adjList.edges.size).toBe(3);
      const vertexA = adjList.edges.get('A');
      expect(vertexA.len).toBe(2);
      expect(vertexA.lookup('C').hasVal).toBeTruthy();
      adjList.removeEdge('A', 'C');
      expect(vertexA.len).toBe(1);
      expect(vertexA.lookup('C').hasVal).toBeFalsy();
    });
    it('should return error while deleting edge D -> A', () => {
      expect(adjList.removeEdge('D', 'A').message).toBe('No edge present between D and A');
    });

    describe('For undirectional Graph', () => {
      let undirectedList;
      beforeEach(() => {
        undirectedList = new AdjacencyList(false);
        undirectedList.addEdge('A', 'B');
        undirectedList.addEdge('A', 'C');
      });

      it('should delete edge A -> C and edge C -> A', () => {
        expect(undirectedList.edges.size).toBe(3);
        const msg = undirectedList.removeEdge('A', 'C');
        expect(undirectedList.edges.get('A').lookup('C').hasVal).toBeFalsy();
        expect(undirectedList.edges.get('C').lookup('A').hasVal).toBeFalsy();
        expect(msg).toBe(void 0);
      });
    });
  });

  describe('Delete Vertex Operation', () => {
    beforeEach(() => {
      adjList.addEdge('A', 'B');
      adjList.addEdge('A', 'C');
    });

    it('should delete vertex C and finally edge A -> C', () => {
      expect(adjList.edges.size).toBe(3);
      expect(adjList.edges.get('A').len).toBe(2);
      expect(adjList.edges.get('A').lookup('C').hasVal).toBeTruthy();

      adjList.removeNode('C');
      expect(adjList.edges.size).toBe(2);
      expect(adjList.edges.get('A').len).toBe(1);
      expect(adjList.edges.get('A').lookup('C').hasVal).toBeFalsy();
    });

    describe('For undirectional Graph', () => {
      let undirectedList;
      beforeEach(() => {
        undirectedList = new AdjacencyList(false);
        undirectedList.addEdge('A', 'B');
        undirectedList.addEdge('A', 'C');
      });

      it('should delete node C and also edges A -> C and C -> A', () => {
        expect(undirectedList.edges.size).toBe(3);
        expect(undirectedList.edges.get('A').len).toBe(2);
        expect(undirectedList.edges.get('A').lookup('C').hasVal).toBeTruthy();
        expect(undirectedList.edges.get('C').len).toBe(1);
        expect(undirectedList.edges.get('C').lookup('A').hasVal).toBeTruthy();

        undirectedList.removeNode('C');

        expect(undirectedList.edges.size).toBe(2);
        expect(undirectedList.edges.get('A').len).toBe(1);
        expect(undirectedList.edges.get('A').lookup('C').hasVal).toBeFalsy();
        expect(undirectedList.edges.has('C')).toBeFalsy();
      });
    });
  });

  describe('Get edge weight', () => {
    beforeEach(() => {
      adjList.addEdge('A', 'B', 200);
      adjList.addEdge('A', 'C', 150);
      adjList.addEdge('B', 'C', 250);
    });

    it('should get 200 as weight between edge A and B', () => {
      const weight = adjList.getEdgeWeight('A', 'B');
      expect(weight).toBe(200);
    });
    it('should get 150 as weight between edge A and C', () => {
      const weight = adjList.getEdgeWeight('A', 'C');
      expect(weight).toBe(150);
    });
    it('should get Error for weight between edge A and D', () => {
      const weight = adjList.getEdgeWeight('A', 'D');
      expect(weight.message).toBe('Edge not found between A and D');
    });
    it('should get Error for weight between edge D and A', () => {
      const weight = adjList.getEdgeWeight('D', 'A');
      expect(weight.message).toBe('Edge not found between D and A');
    });
  });
});