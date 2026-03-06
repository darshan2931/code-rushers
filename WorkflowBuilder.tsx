import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";

type WorkflowSummary = {
  id: number;
  name: string;
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Trigger: Button Click" },
    position: { x: 250, y: 25 },
  },
];

const initialEdges: Edge[] = [];

const WorkflowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [logs, setLogs] = useState<string[]>([]);
  const [sentEmails, setSentEmails] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState("25mss007@kgcas.com");

  const [aiInput, setAiInput] = useState("");
  const [workflowName, setWorkflowName] = useState("untitled-workflow");
  const [workflowList, setWorkflowList] = useState<WorkflowSummary[]>([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH WORKFLOWS ---------------- */

  const fetchWorkflows = async () => {
    try {
      const response = await fetch("/api/workflows");
      const data = await response.json();

      if (data.success) {
        setWorkflowList(data.workflows || []);
      } else {
        console.warn("Failed to load workflows", data.error);
      }
    } catch (error) {
      console.error("Error loading workflows", error);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  /* ---------------- CONNECTION HANDLER ---------------- */

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  /* ---------------- ADD NODE ---------------- */

  const addNode = (type: string, label: string) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: type === "trigger" ? "input" : "default",
      data: { label },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  /* ---------------- AI GENERATE WORKFLOW ---------------- */

  const generateFromAI = async () => {
    if (!aiInput.trim()) {
      alert("Enter workflow description");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: aiInput }),
      });

      const data = await response.json();

      if (data.success && data.workflow) {
        setNodes(data.workflow.nodes || []);
        setEdges(data.workflow.edges || []);

        // Optionally update the name so users can save it quickly
        setWorkflowName(`AI: ${aiInput.slice(0, 40)}`);
      } else {
        alert(data.error || "AI generation failed");
      }
    } catch (error) {
      console.error(error);
      alert("AI request failed");
    } finally {
      setAiInput("");
      setLoading(false);
    }
  };

  /* ---------------- SAVE/LOAD WORKFLOW ---------------- */

  const saveWorkflow = async () => {
    setLoading(true);

    try {
      const payload: any = {
        name: workflowName,
        nodes,
        edges,
      };

      if (selectedWorkflowId) {
        payload.id = selectedWorkflowId;
      }

      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setSelectedWorkflowId(data.workflow.id);
        setWorkflowName(data.workflow.name);
        await fetchWorkflows();
        alert("Workflow saved successfully");
      } else {
        alert(data.error || "Failed to save workflow");
      }
    } catch (error) {
      console.error("Error saving workflow", error);
      alert("Failed to save workflow");
    } finally {
      setLoading(false);
    }
  };

  const loadWorkflow = async () => {
    if (!selectedWorkflowId) {
      alert("Select a workflow to load");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/workflows?id=${selectedWorkflowId}`);
      const data = await response.json();

      if (data.success && data.workflow) {
        setNodes(data.workflow.nodes || []);
        setEdges(data.workflow.edges || []);
        setWorkflowName(data.workflow.name || workflowName);
        alert("Workflow loaded");
      } else {
        alert(data.error || "Failed to load workflow");
      }
    } catch (error) {
      console.error("Error loading workflow", error);
      alert("Failed to load workflow");
    } finally {
      setLoading(false);
    }
  };
  const deleteWorkflow = async () => {
    if (!selectedWorkflowId) {
      alert("Select a workflow to delete");
      return;
    }

    if (!confirm("Delete this workflow?")) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/workflows?id=${selectedWorkflowId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setSelectedWorkflowId(null);
        setWorkflowName("untitled-workflow");
        setNodes(initialNodes);
        setEdges(initialEdges);
        await fetchWorkflows();
        alert("Workflow deleted");
      } else {
        alert(data.error || "Failed to delete workflow");
      }
    } catch (error) {
      console.error("Error deleting workflow", error);
      alert("Failed to delete workflow");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RUN WORKFLOW ---------------- */

  const runWorkflow = () => {
    const timestamp = new Date().toLocaleTimeString();

    let logEntry = `Workflow executed successfully at ${timestamp}`;

    nodes.forEach((node) => {
      if (typeof node.data === "object" && String(node.data?.label).includes("Email")) {
        const email = {
          to: userEmail,
          subject: "Workflow Notification",
          body: "Workflow executed successfully",
          time: timestamp,
        };

        setSentEmails((prev) => [...prev, email]);
      }
    });

    setLogs((prev) => [...prev, logEntry]);
    alert("Workflow executed");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="h-full flex">
      {/* LEFT PANEL */}
      <div className="w-80 bg-gray-100 p-4">
        <h3 className="font-bold mb-3">AI Workflow Builder</h3>

        <div className="mb-3">
          <label className="block text-xs font-semibold mb-1">Workflow</label>
          <select
            value={selectedWorkflowId ?? ""}
            onChange={(e) => {
              const id = Number(e.target.value);
              setSelectedWorkflowId(isNaN(id) ? null : id);
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select existing workflow --</option>
            {workflowList.map((wf) => (
              <option key={wf.id} value={wf.id}>
                {wf.name || `Workflow ${wf.id}`}
              </option>
            ))}
          </select>

          <div className="flex gap-2 mt-2">
            <button
              onClick={loadWorkflow}
              disabled={loading || !selectedWorkflowId}
              className="flex-1 bg-blue-500 text-white p-2 rounded"
            >
              Load
            </button>
            <button
              onClick={deleteWorkflow}
              disabled={loading || !selectedWorkflowId}
              className="flex-1 bg-red-500 text-white p-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-xs font-semibold mb-1">Name</label>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <textarea
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          placeholder="Describe workflow (ex: send email after form submit)"
          className="w-full p-2 border rounded mb-3"
        />

        <button
          onClick={generateFromAI}
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded mb-2"
        >
          {loading ? "Generating…" : "Generate with AI"}
        </button>

        <button
          onClick={saveWorkflow}
          disabled={loading}
          className="w-full bg-green-500 text-white p-2 rounded mb-2"
        >
          {loading ? "Saving…" : "Save Workflow"}
        </button>

        <button
          onClick={() => addNode("trigger", "New Trigger")}
          className="w-full bg-green-500 text-white p-2 rounded mb-2"
        >
          Add Trigger
        </button>

        <button
          onClick={() => addNode("action", "Send Email")}
          className="w-full bg-purple-500 text-white p-2 rounded mb-2"
        >
          Add Action
        </button>

        <button
          onClick={runWorkflow}
          className="w-full bg-red-500 text-white p-2 rounded"
        >
          Run Workflow
        </button>

        <div className="mt-4">
          <h4 className="font-semibold">Email (simulation)</h4>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Your email"
          />
          <div className="mt-2 text-xs text-gray-600">
            Workflow steps containing {"\"Email\""} will add a simulated email log.
          </div>
        </div>
      </div>

      {/* WORKFLOW CANVAS */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      {/* MONITOR PANEL */}
      <div className="w-80 bg-gray-100 p-4">
        <h3 className="font-bold mb-3">Monitoring</h3>

        <p>Nodes: {nodes.length}</p>
        <p>Connections: {edges.length}</p>

        <div className="mt-4">
          <h4 className="font-semibold">Logs</h4>
          {logs.map((log, i) => (
            <p key={i} className="text-xs">
              {log}
            </p>
          ))}
        </div>

        <div className="mt-4">
          <h4 className="font-semibold">Sent Emails (simulated)</h4>
          {sentEmails.map((email, i) => (
            <div key={i} className="text-xs mb-2 border rounded p-2">
              <div className="font-semibold">To: {email.to}</div>
              <div>Subject: {email.subject}</div>
              <div className="text-gray-600 text-xs">{email.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;




