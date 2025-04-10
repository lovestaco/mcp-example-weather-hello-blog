import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server instance
const server = new McpServer({
    name: "blog-tool",
    version: "1.0.0",
});

// Register a frontmatter generation tool
server.tool(
    "get_frontmatter",
    "Generate frontmatter for a blog post",
    {
        content: z.string().describe("The content of the blog post"),
        title: z.string().optional().describe("The title of the blog post"),
        author: z.string().optional().describe("The author of the blog post"),
        tags: z.array(z.string()).optional().describe("Tags for the blog post"),
    },
    async ({ content, title, author, tags }) => {
        // Extract a title from the content if not provided
        const extractedTitle = title || content.split('\n')[0].replace(/^#\s*/, '');

        // Generate frontmatter
        const frontmatter = [
            '---',
            `title: "${extractedTitle}"`,
            author ? `author: "${author}"` : 'author: "Anonymous"',
            `date: "${new Date().toISOString().split('T')[0]}"`,
            tags && tags.length > 0 ? `tags: [${tags.map(tag => `"${tag}"`).join(', ')}]` : 'tags: []',
            '---',
        ].join('\n');

        return {
            content: [
                {
                    type: "text",
                    text: `${frontmatter}\n\n${content}`,
                },
            ],
        };
    }
);

// Register a blog post creation tool
server.tool(
    "create_blog_post",
    "Create a new blog post file with proper frontmatter",
    {
        cwd: z.string().min(1).describe("The root directory of the blog project"),
        title: z.string().min(1).describe("The title of the blog post"),
        content: z.string().describe("The content of the blog post"),
        author: z.string().optional().describe("The author of the blog post"),
        tags: z.array(z.string()).optional().describe("Tags for the blog post"),
        postsDirectory: z.string().default("posts").describe("Directory where posts are stored"),
    },
    async ({ cwd, title, content, author, tags, postsDirectory }) => {
        // In a real implementation, this would create a file
        // For this example, we'll just return the content that would be written

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-');

        const date = new Date().toISOString().split('T')[0];
        const filename = `${date}-${slug}.md`;
        const filepath = `${postsDirectory}/${filename}`;

        // Generate frontmatter
        const frontmatter = [
            '---',
            `title: "${title}"`,
            author ? `author: "${author}"` : 'author: "Anonymous"',
            `date: "${date}"`,
            tags && tags.length > 0 ? `tags: [${tags.map(tag => `"${tag}"`).join(', ')}]` : 'tags: []',
            '---',
        ].join('\n');

        const fileContent = `${frontmatter}\n\n${content}`;

        return {
            content: [
                {
                    type: "text",
                    text: `Blog post would be created at: ${filepath}\n\nContent:\n${fileContent}`,
                },
            ],
        };
    }
);

// Start the server using stdio transport
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Blog MCP Tool running on stdio");
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
}); 