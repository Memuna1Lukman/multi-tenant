# System Specification: Multi-tenant Team Task Tracker

## 1. Overview & Core Concept

The **Multi-tenant Team Task Tracker** is a SaaS application designed for organizations and teams ("workspaces") to manage projects, tasks, and team collaboration. 

### Key Principles
* **Multi-tenancy & Data Isolation:** Workspace data is fully isolated. Users belonging to Company A can never view, query, or interact with Company B's projects, tasks, comments, or membership lists.
* **Flexible Association:** A single user (person) can be a member of multiple workspaces simultaneously, holding distinct roles (e.g., `Admin` in Workspace A, `Employee` in Workspace B).
* **Role-Based Access Control (RBAC):** Permissions are strictly bound to workspace membership rather than global user attributes.

---

## 2. Entity Hierarchy & Data Model

### Data Hierarchy
```
Workspace
 └── Project (FK: workspace_id)
      └── Task (FK: project_id)
           └── Comment (FK: task_id)
```
*Note: Tasks do not store a direct `workspace_id` foreign key; workspace context is resolved transitively via `Project`.*

```
User ──< Membership >── Workspace
```

---

## 3. Detailed Database Schema Blueprint

### 1. `users`
Stores global identity across the entire platform.
* `id` (UUID / BIGINT, Primary Key)
* `email` (VARCHAR, Unique, Indexed) — User's primary email address
* `password_hash` (VARCHAR) — Hashed credential
* `full_name` (VARCHAR) — Display name
* `avatar_url` (VARCHAR, Nullable)
* `created_at` (TIMESTAMP WITH TIME ZONE)
* `updated_at` (TIMESTAMP WITH TIME ZONE)

### 2. `workspaces`
Top-level tenant boundary.
* `id` (UUID / BIGINT, Primary Key)
* `name` (VARCHAR) — Company/Team name
* `slug` (VARCHAR, Unique, Indexed) — URL-friendly identifier
* `created_at` (TIMESTAMP WITH TIME ZONE)
* `updated_at` (TIMESTAMP WITH TIME ZONE)

### 3. `memberships`
Junction table mapping users to workspaces and defining their role within that specific workspace.
* `id` (UUID / BIGINT, Primary Key) — *Recommended for ORM compatibility, alongside `UNIQUE(user_id, workspace_id)`*
* `user_id` (UUID / BIGINT, Foreign Key -> `users.id` ON DELETE CASCADE)
* `workspace_id` (UUID / BIGINT, Foreign Key -> `workspaces.id` ON DELETE CASCADE)
* `role` (ENUM: `'ADMIN'`, `'EMPLOYEE'`) — Role within this specific workspace
* `joined_at` (TIMESTAMP WITH TIME ZONE)
* **Constraints & Indexes:**
  * `UNIQUE(user_id, workspace_id)` — Prevents duplicate memberships in the same workspace.

### 4. `projects`
Containers for tasks within a workspace.
* `id` (UUID / BIGINT, Primary Key)
* `workspace_id` (UUID / BIGINT, Foreign Key -> `workspaces.id` ON DELETE CASCADE)
* `name` (VARCHAR)
* `description` (TEXT, Nullable)
* `status` (ENUM: `'ACTIVE'`, `'ARCHIVED'`, `'COMPLETED'`)
* `created_by_user_id` (UUID / BIGINT, Foreign Key -> `users.id`)
* `created_at` (TIMESTAMP WITH TIME ZONE)
* `updated_at` (TIMESTAMP WITH TIME ZONE)

### 5. `tasks`
Individual items of work assigned within a project.
* `id` (UUID / BIGINT, Primary Key)
* `project_id` (UUID / BIGINT, Foreign Key -> `projects.id` ON DELETE CASCADE)
* `title` (VARCHAR)
* `description` (TEXT, Nullable)
* `status` (ENUM: `'TODO'`, `'IN_PROGRESS'`, `'REVIEW'`, `'DONE'`)
* `priority` (ENUM: `'LOW'`, `'MEDIUM'`, `'HIGH'`, `'URGENT'`)
* `assigned_to_user_id` (UUID / BIGINT, Foreign Key -> `users.id`, Nullable)
* `created_by_user_id` (UUID / BIGINT, Foreign Key -> `users.id`)
* `due_date` (TIMESTAMP WITH TIME ZONE, Nullable)
* `created_at` (TIMESTAMP WITH TIME ZONE)
* `updated_at` (TIMESTAMP WITH TIME ZONE)

### 6. `comments`
Discussion entries tied to a specific task.
* `id` (UUID / BIGINT, Primary Key)
* `task_id` (UUID / BIGINT, Foreign Key -> `tasks.id` ON DELETE CASCADE)
* `author_user_id` (UUID / BIGINT, Foreign Key -> `users.id`)
* `body` (TEXT)
* `created_at` (TIMESTAMP WITH TIME ZONE)
* `updated_at` (TIMESTAMP WITH TIME ZONE)

### 7. `invites` (Pending Invites Table)
Tracks email invitations sent by admins to onboard new or existing users.
* `id` (UUID / BIGINT, Primary Key)
* `workspace_id` (UUID / BIGINT, Foreign Key -> `workspaces.id` ON DELETE CASCADE)
* `email` (VARCHAR, Indexed) — Target email address
* `role` (ENUM: `'ADMIN'`, `'EMPLOYEE'`) — Assigned role upon acceptance
* `token` (VARCHAR, Unique, Indexed) — Cryptographically secure token
* `invited_by_user_id` (UUID / BIGINT, Foreign Key -> `users.id`)
* `expires_at` (TIMESTAMP WITH TIME ZONE)
* `accepted_at` (TIMESTAMP WITH TIME ZONE, Nullable)
* `created_at` (TIMESTAMP WITH TIME ZONE)

---

## 4. Roles & Permissions Matrix

| Action / Capability | Admin | Employee | Notes |
| :--- | :---: | :---: | :--- |
| **Manage Workspace (Rename, Settings)** | ✅ | ❌ | Admin only |
| **Invite / Remove Workspace Members** | ✅ | ❌ | Admin only |
| **View Workspace Member List** | ✅ | ✅ | Employees can view team list for task assignment awareness and context |
| **Create / Edit / Delete Projects** | ✅ | ❌ | Structurally managed by Admins |
| **Create / Edit / Delete Tasks** | ✅ | ❌ | Admins control task definition & assignment |
| **Change Task Status (Mark Done)** | ✅ | ✅ (If Assigned) | Employees can update status on tasks assigned to them |
| **Create Comments** | ✅ | ✅ | Any member can comment on tasks within their workspace |
| **Edit / Delete Own Comments** | ✅ | ✅ | Authors have full CRUD over their own comments |
| **Delete Others' Comments** | ✅ | ❌ | **Only Admins** can delete comments made by other members |
| **Leave Workspace** | ❌ | ✅ | **Admins cannot leave** to prevent zero-admin workspaces |

### Key Rule Restrictions
1. **Admin Invariance Rule:** An Admin **cannot leave** a workspace. This structurally guarantees that no workspace ever becomes orphaned without an administrator.
2. **Comment Governance Rule:** An Employee can edit or delete their *own* comment. Only an Admin can delete comments posted by other users.

---

## 5. Workflows

### Invite Flow
1. **Initiation:** An Admin inputs an email address and role into the workspace settings.
2. **Token Generation:** System generates a secure, random invite token (e.g., 256-bit entropy UUID or hash) stored in the `invites` table with an expiration timestamp (e.g., 7 days).
3. **Email Dispatch:** An invitation link containing the token (e.g., `https://app.example.com/invite/accept?token=<TOKEN>`) is emailed to the invitee.
4. **Acceptance / Resolution:**
   * **Case A: Existing User Account:**
     1. Invitee clicks the link and logs in (if not already authenticated).
     2. System checks if `users.email` matches `invites.email`.
     3. System creates a `memberships` record (`user_id`, `workspace_id`, `role`).
     4. `invites.accepted_at` is updated.
   * **Case B: New User:**
     1. Invitee clicks the link and is directed to a registration page pre-filled with their email.
     2. Upon completing account creation (`users` row created), the token is processed.
     3. System creates the corresponding `memberships` record.
     4. `invites.accepted_at` is updated.

---

## 6. Open Technical Decisions & Recommendations

### Decision 1: `memberships` Primary Key Strategy
* **Recommendation:** Use a surrogate primary key `id` (UUID / BIGINT) alongside a explicit `UNIQUE(user_id, workspace_id)` constraint.
* **Rationale:** While `(user_id, workspace_id)` forms a natural composite primary key, many ORMs (e.g., Prisma, TypeORM, Rails ActiveRecord) and web APIs perform better with simple single-column IDs when referencing membership instances or auditing logs.

### Decision 2: Invite Token Mechanism & Security
* **Recommendation:**
  * Store hashed tokens in `invites` (`token_hash`) using SHA-256, sending the unhashed token in the email link.
  * Set a standard expiration window (e.g., 7 days).
  * Automatically clean up or ignore expired/accepted invite tokens upon validation.

### Decision 3: Efficient Tenant Data Isolation
* **Recommendation:** Enforce tenant isolation in database queries at the application framework / ORM level (e.g., via middleware or scoping hooks) that verify every database read/write checks that `project.workspace_id` matches the authenticated user's active `workspace_id`.