import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server instance
const server = new McpServer({
    name: "weather-tool",
    version: "1.0.0",
});

// Register a weather alerts tool
server.tool(
    "get_alerts",
    "Get weather alerts for a state",
    {
        state: z.string().min(2).max(2).describe("Two-letter state code (e.g. CA, NY)"),
    },
    async ({ state }) => {
        // In a real implementation, this would call a weather API
        // For this example, we'll just return mock data
        const mockAlerts = {
            "CA": ["Wildfire warning in Northern California", "Heat advisory in Southern California"],
            "NY": ["Flood warning in Western New York", "Thunderstorm watch in NYC metro area"],
            "FL": ["Hurricane watch along the coast", "Flood warning in South Florida"],
        };

        const alerts = (mockAlerts as Record<string, string[]>)[state] || ["No current alerts for this state"];

        return {
            content: [
                {
                    type: "text",
                    text: `Weather Alerts for ${state}:\n${alerts.map(alert => `- ${alert}`).join('\n')}`,
                },
            ],
        };
    }
);

// Start the server using stdio transport
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Weather MCP Tool running on stdio");
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
}); 