# Endpoints

1. GET all todos - return a list of all paginated todos.

Endpoint: `GET /api/todos?search=[search]&page=[page]&limit=[limit]&status=[status]`

Request:

- `search` - (string) search title of todos
- `page` - (number) page number
- `limit` - (number) number of todos to be returned per page
- `status` - (all | done | pending) status of todo

Response:

`200 - ok`

```json
{
  "status": "ok",
  "message": "ok",
  "data": [
    {
      "id": 1,
      "title": "Todo1",
      "description": "Add notes",
      "status": "pending"
    },
    {
      "id": 2,
      "title": "Todo2",
      "description": "Update notes",
      "status": "done"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 10
  }
}
```

2. GET todo - Get a specific todo

Endpoint: `GET /api/todos/:id`

Request:

- `id` - (number) id of todo

Response:

`200 - ok`

```json
{
  "status": "ok",
  "message": "ok",
  "data": {
    "id": 2,
    "title": "Todo2",
    "description": "Update notes",
    "status": "pending"
  }
}
```

`404 - not found`

```json
{
  "status": "not_found",
  "message": "Todo not found."
}
```

3. Create todo - create a todo.

Endpoint: `POST /api/todos`

Request:

```json
{
  "title": "Todo3",
  "description": "Delete notes"
}
```

Response:

`201 - created`

```json
{
  "message": "Todo created successfully.",
  "todo": {
    "title": "Test",
    "description": "Test",
    "status": "pending",
    "userId": "698ea4bc9371aeab75b788cd",
    "_id": "69923c9d064fc1bf7c090d4b",
    "createdAt": "2026-02-15T21:37:33.638Z",
    "updatedAt": "2026-02-15T21:37:33.638Z",
    "__v": 0
  }
}
```

`422 - validation errors`

```json
{
  "status": "validation_error",
  "message": "One or more validation error occured.",
  "errors": {
    "title": "Title is required.",
    "description": "Description is too long."
  }
}
```

`400 - bad request`

```json
{
  "status": "error",
  "message": "Todo already exist."
}
```

4. Update todo - edit title, description, status of todo

Endpoint: `PUT /api/todos/:id`

Request:

- \*`id` - (**number**) id of todo

```json
{
  "title": "Todo 1 edited",
  "description": "Desc edited",
  "status": "done"
}
```

Response:

`200 - ok`

```json
{
  "message": "Todo updated successfully.",
  "todo": {
    "_id": "69923ac4298e0111c1c06504",
    "title": "Test updated",
    "description": "Description 2",
    "status": "done",
    "userId": "698ea4bc9371aeab75b788cd",
    "createdAt": "2026-02-15T21:29:40.269Z",
    "updatedAt": "2026-02-15T21:39:49.461Z",
    "__v": 0
  }
}
```

`422 - validation error for Title field`

```json
{
  "success": false,
  "message": "Title is required.",
  "stack": "AppError: Title is required.\n    at updateTodo (C:path)\n    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)"
}
```

`422 - validation error for Status field`

```json
{
  "success": false,
  "message": "Status is required.",
  "stack": "AppError: Title is required.\n    at updateTodo (C:path)\n    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)"
}
```

`400 - bad request`

```json
{
  "status": "error",
  "message": "Title already exists."
}
```

5. Delete todo - delete an existing todo.

Endpoint: `DELETE /api/todos/:id`

Request:

- `id` - (**number**) id of todo

Response:

`200 - ok`

```json
{
  "message": "Todo deleted successfully."
}
```

`404 - not found`

```json
{
  "success": false,
  "message": "Todo not found.",
  "stack": "AppError: Todo not found.\n    at deleteTodo (C:path)\n    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)"
}
```

`400 - bad request`

```json
{
  "success": false,
  "message": "Failed to delete todo.",
  "stack": "AppError: Failed to delete todo.\n    at deleteTodo (C:path)\n    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)"
}
```
