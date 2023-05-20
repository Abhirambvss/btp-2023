/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, { ReactFlowProvider, Controls, addEdge, ConnectionLineType, useNodesState, useEdgesState } from 'reactflow';
import dagre from 'dagre';
import { useLocation } from 'react-router-dom';
import Modal from './modal';
import 'reactflow/dist/style.css';


const position = { x: 0, y: 0 };
const edgeType = 'smoothstep';





const initialEdges = [
    { id: 'e12', source: '1', target: '2', type: edgeType, animated: true },
    { id: 'e13', source: '1', target: '3', type: edgeType, animated: true },
    { id: 'e22a', source: '2', target: '2a', type: edgeType, animated: true },
    { id: 'e22b', source: '2', target: '2b', type: edgeType, animated: true },
    { id: 'e22c', source: '2', target: '2c', type: edgeType, animated: true },
    { id: 'e2c2d', source: '2c', target: '2d', type: edgeType, animated: true },
    { id: 'e45', source: '4', target: '5', type: edgeType, animated: true },
    { id: 'e56', source: '5', target: '6', type: edgeType, animated: true },
    { id: 'e57', source: '5', target: '7', type: edgeType, animated: true },
];


const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
    const isVertical = direction === 'TB';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isVertical ? 'top' : 'left';
        node.sourcePosition = isVertical ? 'bottom' : 'right';

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return { nodes, edges };
};


const LayoutFlow = () => {

    const [cegN, setCegN] = useState([]);
    const location = useLocation();
    const cegNode = location.state.data1;
    const cegEdges = location.state.data2;
    const expression = location.state.data3;
    console.log(expression);
    // console.log(cegNode[4].id === cegEdges[0].target);

    const initialNodes = [
        {
            id: '1',
            type: 'input',
            data: { label: 'input' },
            position,
        },
        {
            id: '2',
            data: { label: 'node 2' },
            position,
        },
        {
            id: '2a',
            data: { label: 'node 2a' },
            position,
        },
        {
            id: '2b',
            data: { label: 'node 2b' },
            position,
        },
        {
            id: '2c',
            data: { label: 'node 2c' },
            position,
        },
        {
            id: '2d',
            data: { label: 'node 2d' },
            position,
        },
        {
            id: '3',
            data: { label: 'node 3' },
            position,
        },
        {
            id: '4',
            data: { label: 'node 4' },
            position,
        },
        {
            id: '5',
            data: { label: 'node 5' },
            position,
        },
        {
            id: '6',
            type: 'output',
            data: { label: 'output' },
            position,
        },
        { id: '7', type: 'output', data: { label: 'output' }, position },
    ];

    const [rfInstance, setRfInstance] = useState(null);
    const [nodeId, setnodeId] = useState();
    const [text, setText] = useState("");

    const handleClick = () => {
        setNodes((nd) =>
            nd.map((node) => {
                if (node.id === nodeId) {
                    node.data = {
                        ...node.data,
                        label: text,
                    };
                }

                return node;
            })
        );

    }

    const onSave = useCallback(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            console.log(flow);
            localStorage.setItem('flowKey', JSON.stringify(flow));
        }
    }, [rfInstance]);


    const handleChange = (event) => {
        setText(event.target.value);
    }

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        cegNode,
        cegEdges
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

    // const onNodesChange = useCallback(
    //     (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    //     [setNodes]
    //   );
    //   const onEdgesChange = useCallback(
    //     (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    //     [setEdges]
    //   );
    const onConnect = useCallback(
        (params) =>
            setEdges((eds) =>
                addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)
            ),
        []
    );
    const onLayout = useCallback(
        (direction) => {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                cegNode,
                cegEdges,
                direction
            );

            setNodes([...layoutedNodes]);
            setEdges([...layoutedEdges]);
        },
        [nodes, edges]
    );

    const proOptions = { hideAttribution: true };

    return (
        <>

            {/* <div className="flex place-items-center">
                <button className=" items-center p-1 rounded-lg border-2 mx-2 border-gray-700" onClick={() => onLayout('TB')}>vertical layout</button>
                <button className="items-center p-1 rounded-lg border-2 border-gray-700" onClick={() => onLayout('LR')}>horizontal layout</button>
            </div> */}
            <div className="p-2 mx-2 w-28 h-28" style={{ width: '98vw', height: '85vh' }} >
                <div className="flex items-center">
                    <input value={text} onChange={handleChange} className="border-2 border-indigo-600"></input>
                    <button onClick={handleClick} className="rounded-lg border-2 mx-2 border-gray-700 p-1">Update Node</button>
                    <button onClick={onSave} className="rounded-lg border-2 ml-96 border-gray-700 p-1">Save Graph</button>
                </div>
                <div className="mt-2 overflow-x-auto">
                    {expression.map((item, index) => (

                        <Modal key={index} effect={item.effect} boolExpression={item.boolExpression} expression={expression} />

                    ))}
                </div>
                <ReactFlow className='my-2 border-2 border-gray-200'
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    connectionLineType={ConnectionLineType.SmoothStep}
                    proOptions={proOptions}
                    onInit={setRfInstance}
                    onNodeClick={(event, node) => {
                        setText(node.data.label);
                        setnodeId(node.id);
                    }}
                    fitView>
                    {/* <MiniMap /> */}
                    <Controls />
                </ReactFlow>
            </div>
        </>
    );
};

const Login = () => {
    return (
        <ReactFlowProvider>
            <LayoutFlow />
        </ReactFlowProvider>
    )
};
export default Login;