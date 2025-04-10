import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server instance
const server = new McpServer({
  name: "mcp-tools",
  version: "1.0.0",
});

// Register a simple Hello tool
server.tool(
  "Hello",
  "Get a greeting with your name",
  {
    name: z.string().describe("Your name"),
  },
  async ({ name }) => {
    return {
      content: [
        {
          type: "text",
          text: `Hello, ${name}! Welcome to MCP Tools.`,
        },
      ],
    };
  }
);

// Start the server using stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
