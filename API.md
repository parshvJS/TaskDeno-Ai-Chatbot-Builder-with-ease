# Chatbot Embedding and API Integration

{
  "project_id": "project-1",
  "user_id": "user-1",
  "project_name": "Complex Project",
  "variables": [
    { "name": "userName", "type": "string", "defaultValue": "" },
    { "name": "age", "type": "number", "defaultValue": 0 }
  ],
  "nodes": [
    {
      "id": "node-1",
      "type": "text",
      "position": { "x": 100, "y": 100 },
      "data": { "label": "Hello, what's your name?" }
    },
    {
      "id": "node-2",
      "type": "input",
      "position": { "x": 100, "y": 200 },
      "data": { "label": "Please enter your name:", "variable": "userName" }
    },
    {
      "id": "node-3",
      "type": "text",
      "position": { "x": 100, "y": 300 },
      "data": { "label": "How old are you?" }
    },
    {
      "id": "node-4",
      "type": "input",
      "position": { "x": 100, "y": 400 },
      "data": { "label": "Please enter your age:", "variable": "age" }
    },
    {
      "id": "node-5",
      "type": "condition",
      "position": { "x": 100, "y": 500 },
      "data": { "label": "Check if user is an adult", "condition": "age >= 18" }
    },
    {
      "id": "node-6",
      "type": "text",
      "position": { "x": 100, "y": 600 },
      "data": { "label": "You are an adult." }
    },
    {
      "id": "node-7",
      "type": "text",
      "position": { "x": 100, "y": 700 },
      "data": { "label": "You are a minor." }
    }
  ],
  "edges": [
    { "id": "edge-1", "source": "node-1", "target": "node-2" },
    { "id": "edge-2", "source": "node-2", "target": "node-3" },
    { "id": "edge-3", "source": "node-3", "target": "node-4" },
    { "id": "edge-4", "source": "node-4", "target": "node-5" },
    { "id": "edge-5", "source": "node-5", "target": "node-6", "condition": "true" },
    { "id": "edge-6", "source": "node-5", "target": "node-7", "condition": "false" }
  ],
  "node_content": [
    { "id": "node-1", "ai": "Hello, what's your name?", "user": "" },
    { "id": "node-3", "ai": "How old are you?", "user": "" }
  ],
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}

## Full List with Descriptions

1. **/api/createProject (POST)**
   - **Body**: `{ name: string, userId: id }`
   - **Description**: Creates a new project when the user clicks on "Create New Project".

2. **/api/updateStatus (POST)**
   - **Body**: `{ /* all updated data */ }`
   - **Description**: Synchronizes all data to the database and saves the user’s progress after some time.

3. **/api/aiGotHit (POST)**
   - **Body**: `{ chatbotId: id }`
   - **Description**: Increases the count of hits to the AI from chatbot instances.

4. **/api/redirected (GET)**
   - **Parameters**: `{ chatbotId: string, userId: string }`
   - **Description**: Tracks how many users successfully converted and generated leads via the chatbot.

5. **/js/embed.js**
   - **Description**: Serves the JavaScript file for the user's chatbot to embed on their website.

6. **/api/chatbotConfig**
   - **Description**: Returns the configuration and style of the chatbot.

7. **/api/userMessage (POST)**
   - **Body**: `{ chatbotId: id, message: string, userId: string }`
   - **Description**: Interacts with the user's response.

8. **/api/projects (GET)**
   - **Parameters**: `{ userId: string }`
   - **Description**: Fetches a list of projects for a specific user.

9. **/api/project/:projectId (GET)**
   - **Parameters**: `{ projectId: string }`
   - **Description**: Fetches details of a specific project.

10. **/api/chatbot-instances (POST)**
    - **Body**: `{ chatbotId: string, userId: string }`
    - **Description**: Creates a new chatbot instance for a user.

11. **/api/chatbot-variables (POST)**
    - **Body**: `{ instanceId: string, variableName: string, variableValue: string }`
    - **Description**: Stores or updates the value of a variable for a specific chatbot instance.

## Example Workflow

1. **Create a New Project**: User clicks "Create New Project", which calls `/api/createProject`.
2. **Synchronize Data**: Regularly call `/api/updateStatus` to save user progress.
3. **Embed Chatbot**: User embeds the chatbot using `<script async data-id="4384248457" id="chatling-embed-script" type="text/javascript" src="https://yourdomain.com/js/embed.js"></script>`.
4. **Load Chatbot Configuration**: The iframe loads, calls `/api/chatbotConfig` to get the chatbot settings.
5. **User Interacts**: Messages are sent to `/api/userMessage` to interact with the chatbot.
6. **Track Conversions**: When a user completes a goal, call `/api/redirected` to track conversions.
7. **Track Hits**: Increase chatbot hits via `/api/aiGotHit`.

This comprehensive approach ensures that you cover all necessary aspects of chatbot creation, management, embedding, and interaction.
