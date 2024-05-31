document.addEventListener("DOMContentLoaded", () => {
    // Mock function to get the status of nodes
    function getStatus() {
        return [
            { id: 1, name: "Node 1", status: "Connected" },
            { id: 2, name: "Node 2", status: "Disconnected" },
            { id: 3, name: "Node 3", status: "Connected" }
        ];
    }

    // Function to update node status
    function updateNodeStatus() {
        const nodeList = document.getElementById("node-list");
        nodeList.innerHTML = ""; // Clear the list
        const statuses = getStatus();

        statuses.forEach(node => {
            const listItem = document.createElement("li");
            listItem.textContent = `${node.name}: ${node.status}`;
            nodeList.appendChild(listItem);
        });
    }

    // Function to handle command input and update traffic log
    function handleCommand() {
        const commandInput = document.getElementById("command-input");
        const trafficLog = document.getElementById("traffic-log");
        
        const command = commandInput.value.trim();
        if (command) {
            const logEntry = document.createElement("div");
            logEntry.textContent = `Command sent to edge: ${command}`;
            trafficLog.appendChild(logEntry);
            commandInput.value = ""; // Clear input field
        }
    }

    // Set up event listeners
    document.getElementById("send-command").addEventListener("click", handleCommand);
    updateNodeStatus(); // Initial status update
});
