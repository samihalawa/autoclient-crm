# Twenty CRM - 20 Critical User Workflows Analysis

**Date:** 2025-10-26
**Purpose:** Comprehensive workflow testing and validation
**Status:** Documentation Phase → Testing Phase → Fix Phase → Verification Phase

---

## Workflow Priority Matrix

### High Priority (Must Work for MVP)
- Workflows 1-5: Core CRM Operations
- Workflows 6-8: Automation Features
- Workflow 13: Custom Objects

### Medium Priority (Important for Production)
- Workflows 9-12: Settings & Configuration
- Workflows 14-16: Data Management

### Lower Priority (Advanced Features)
- Workflows 17-20: Integrations & Advanced Config

---

## WORKFLOW 1: Create and Manage Person Contact

**Priority:** 🔴 CRITICAL
**Route:** `/objects/people`
**Component:** `packages/twenty-front/src/pages/objects/RecordIndexPage.tsx`

### Steps:
1. Navigate to People page from sidebar
2. Click "+" button to add new person
3. Fill in required fields (Name, Email)
4. Add optional fields (Company, Phone, LinkedIn, etc.)
5. Click "Save" to create person
6. View person details in record page
7. Edit person information
8. Add notes and tasks to person
9. Delete person (with confirmation)

### Expected Behavior:
- ✅ Navigation loads People page
- ✅ Add button opens create modal/form
- ✅ Form validation prevents invalid email formats
- ✅ Save creates person record in database
- ✅ Record appears in People list
- ✅ Click person opens detail view
- ✅ Edit updates person information
- ✅ Delete removes person from database

### Test Cases:
```
TC1.1: Create person with minimal required fields
TC1.2: Create person with all fields populated
TC1.3: Validate email format (must include @)
TC1.4: Prevent duplicate email addresses
TC1.5: Edit existing person details
TC1.6: Add note to person
TC1.7: Add task to person
TC1.8: Delete person
TC1.9: View person activity timeline
```

### Files to Check:
- RecordIndexPage.tsx
- RecordShowPage.tsx
- RecordBoardPage.tsx
- People object metadata configuration
- GraphQL mutations: createPerson, updatePerson, deletePerson

---

## WORKFLOW 2: Create and Manage Company

**Priority:** 🔴 CRITICAL
**Route:** `/objects/companies`
**Component:** `packages/twenty-front/src/pages/objects/RecordIndexPage.tsx`

### Steps:
1. Navigate to Companies page from sidebar
2. Click "+" to add new company
3. Fill company details (Name, Domain URL, Employee count)
4. Add address and social links
5. Associate people with company
6. Save company record
7. View company details
8. Add opportunities to company
9. Edit company information
10. Archive or delete company

### Expected Behavior:
- ✅ Navigation loads Companies page
- ✅ Create form validates domain URL format
- ✅ Employee count accepts numeric input only
- ✅ Company-Person relationship created
- ✅ Company appears in list view
- ✅ Detail view shows related people
- ✅ Can add opportunities to company
- ✅ Edit updates company info
- ✅ Archive preserves data, delete removes

### Test Cases:
```
TC2.1: Create company with required fields
TC2.2: Validate domain URL format
TC2.3: Associate person with company
TC2.4: View company details with related people
TC2.5: Add opportunity to company
TC2.6: Edit company information
TC2.7: Archive company
TC2.8: Delete company with confirmation
TC2.9: Search and filter companies
```

### Files to Check:
- RecordIndexPage.tsx (Companies view)
- Company object metadata
- Relation field components
- GraphQL: createCompany, updateCompany, deleteCompany

---

## WORKFLOW 3: Create and Track Opportunity Through Pipeline

**Priority:** 🔴 CRITICAL
**Route:** `/objects/opportunities`
**Component:** `RecordBoardPage.tsx` (Kanban view)

### Steps:
1. Navigate to Opportunities page
2. View opportunities in Kanban board by stage
3. Click "+" to create new opportunity
4. Fill opportunity details (Name, Amount, Close Date)
5. Associate opportunity with Company and Person
6. Set opportunity stage (New, Qualifying, Proposal, etc.)
7. Drag opportunity between stages
8. Update opportunity amount
9. Add notes and tasks to opportunity
10. Mark opportunity as Won or Lost

### Expected Behavior:
- ✅ Kanban board displays opportunities by stage
- ✅ Create modal opens with form
- ✅ Amount field validates numeric input
- ✅ Date picker for close date
- ✅ Company/Person association dropdown works
- ✅ Drag-and-drop updates stage
- ✅ Stage change triggers workflow (if configured)
- ✅ Won/Lost marks opportunity complete
- ✅ Analytics update based on opportunity changes

### Test Cases:
```
TC3.1: Create opportunity with all fields
TC3.2: Associate with company and person
TC3.3: Set close date in future
TC3.4: Drag opportunity to next stage
TC3.5: Update opportunity amount
TC3.6: Add note to opportunity
TC3.7: Mark opportunity as Won
TC3.8: Mark opportunity as Lost
TC3.9: Filter opportunities by stage
TC3.10: View opportunity analytics
```

### Files to Check:
- RecordBoardPage.tsx
- Opportunity object metadata
- Kanban board components
- Stage field configuration
- GraphQL: createOpportunity, updateOpportunity

---

## WORKFLOW 4: Create and Complete Task

**Priority:** 🔴 CRITICAL
**Route:** `/objects/tasks`
**Component:** Task management components

### Steps:
1. Navigate to Tasks page
2. Click "+" to create new task
3. Fill task title and description
4. Assign task to user
5. Set due date
6. Associate task with Person/Company/Opportunity
7. Save task
8. View task in list
9. Mark task as complete
10. View completed tasks

### Expected Behavior:
- ✅ Tasks page loads with list view
- ✅ Create form opens
- ✅ User assignment dropdown populated
- ✅ Due date picker works
- ✅ Task-record associations created
- ✅ Task appears in assignee's task list
- ✅ Checkbox marks task complete
- ✅ Completed tasks filtered separately
- ✅ Notifications sent to assignee

### Test Cases:
```
TC4.1: Create task with title only
TC4.2: Create task with all fields
TC4.3: Assign task to user
TC4.4: Set due date today
TC4.5: Associate task with opportunity
TC4.6: Mark task complete
TC4.7: View completed tasks
TC4.8: Edit existing task
TC4.9: Delete task
```

### Files to Check:
- Task object metadata
- Task list components
- User assignment logic
- Notification system
- GraphQL: createTask, updateTask

---

## WORKFLOW 5: Create and Manage Note

**Priority:** 🟡 HIGH
**Route:** Embedded in record detail pages
**Component:** Note components

### Steps:
1. Open any record (Person/Company/Opportunity)
2. Navigate to Notes tab or section
3. Click "Add Note" button
4. Type note content (rich text editor)
5. Format text (bold, italic, lists)
6. @mention users for notifications
7. Save note
8. View note in timeline
9. Edit existing note
10. Delete note

### Expected Behavior:
- ✅ Notes section visible on record pages
- ✅ Rich text editor loads
- ✅ Formatting buttons work
- ✅ @mentions trigger user search
- ✅ Save creates note record
- ✅ Note appears in activity timeline
- ✅ Edit updates note content
- ✅ Delete removes note
- ✅ @mentioned users receive notification

### Test Cases:
```
TC5.1: Create plain text note
TC5.2: Create formatted note with bold/italic
TC5.3: Create bulleted list note
TC5.4: @mention user in note
TC5.5: Edit existing note
TC5.6: Delete note with confirmation
TC5.7: View notes in timeline order
```

### Files to Check:
- Note components
- Rich text editor integration
- @mention functionality
- Timeline/activity feed
- GraphQL: createNote, updateNote, deleteNote

---

## WORKFLOW 6: Create Automated Workflow

**Priority:** 🔴 CRITICAL (Core Feature)
**Route:** `/settings/workflows`
**Component:** Workflow builder components

### Steps:
1. Navigate to Settings → Workflows
2. Click "Create Workflow" button
3. Name workflow and add description
4. Select trigger type (Record Created, Record Updated, etc.)
5. Configure trigger conditions (if/when filters)
6. Add first action step
7. Configure action (Create Record, Send Email, Update Field)
8. Add additional action steps
9. Test workflow with sample data
10. Activate workflow
11. Monitor workflow executions

### Expected Behavior:
- ✅ Workflows page loads with list
- ✅ Create modal opens
- ✅ Trigger dropdown populated with types
- ✅ Condition builder allows field selection
- ✅ Action step form opens
- ✅ Can chain multiple actions
- ✅ Test mode runs workflow without saving
- ✅ Activate enables workflow
- ✅ Workflow triggers on matching events
- ✅ Execution history visible

### Test Cases:
```
TC6.1: Create workflow with trigger only
TC6.2: Add condition to trigger
TC6.3: Add "Create Record" action
TC6.4: Add "Update Field" action
TC6.5: Add "Send Email" action
TC6.6: Chain 3+ actions together
TC6.7: Test workflow execution
TC6.8: Activate workflow
TC6.9: Trigger workflow and verify execution
TC6.10: View execution history
TC6.11: Edit existing workflow
TC6.12: Deactivate workflow
```

### Files to Check:
- Workflow builder components
- Trigger configuration
- Action step components
- Workflow execution engine
- GraphQL: createWorkflow, updateWorkflow, executeWorkflow
- Backend: workflow-trigger.service.ts, workflow-executor.service.ts

---

## WORKFLOW 7: Create and Configure Sequence

**Priority:** 🟡 HIGH (New Feature)
**Route:** `/sequences` (if routed) or custom page
**Component:** `packages/twenty-front/src/modules/sequences/components/SequencesView.tsx`

### Steps:
1. Navigate to Sequences page
2. Click "Create Sequence" button
3. Name sequence and add description
4. Add first email step
5. Compose email or use AI assistant
6. Insert variables ({{person.name.first}}, etc.)
7. Add wait step (e.g., wait 2 days)
8. Add second email step
9. Configure sequence settings (business days, sending window)
10. Set exit criteria (replied, opened, etc.)
11. Publish sequence
12. Enroll recipients
13. Monitor sequence performance

### Expected Behavior:
- ✅ Sequences page loads (route must be configured)
- ✅ Create modal opens
- ✅ Email editor with rich text
- ✅ AI assistant modal works
- ✅ Variable picker inserts {{variables}}
- ✅ Wait step accepts day input
- ✅ Settings panel saves configuration
- ✅ Publish creates immutable version
- ✅ Enroll modal shows recipients
- ✅ Sequence sends emails on schedule
- ✅ Performance dashboard shows metrics

### Test Cases:
```
TC7.1: Create sequence with name
TC7.2: Add email step
TC7.3: Compose email with AI
TC7.4: Insert variables into email
TC7.5: Add wait step
TC7.6: Configure sending window
TC7.7: Set exit criteria
TC7.8: Publish sequence
TC7.9: Enroll 3 recipients
TC7.10: Verify first email sent
TC7.11: Monitor sequence progress
TC7.12: Recipient exits on reply
```

### Files to Check:
- SequencesView.tsx (just created)
- Sequence API/GraphQL endpoints (needs implementation)
- Email sending service integration
- Sequence execution scheduler
- Performance tracking system

### Status: ⚠️ **NEEDS INTEGRATION** - UI complete, backend integration required

---

## WORKFLOW 8: Set Up AI Agent Workflow

**Priority:** 🟡 HIGH (Advanced Feature)
**Route:** `/settings/ai-agents` or workflow builder
**Component:** AI agent configuration

### Steps:
1. Navigate to AI Agents settings
2. Click "Create AI Agent"
3. Name agent and select purpose
4. Configure AI model (GPT-4, Claude, etc.)
5. Set agent instructions/prompts
6. Define input parameters
7. Configure output format
8. Set trigger conditions
9. Test agent with sample data
10. Activate agent
11. Monitor agent executions

### Expected Behavior:
- ✅ AI Agents page loads
- ✅ Create form opens
- ✅ Model dropdown populated
- ✅ Instruction editor allows rich text
- ✅ Parameter configuration works
- ✅ Output format defined
- ✅ Trigger integration with workflows
- ✅ Test mode runs agent
- ✅ Activation enables agent
- ✅ Execution logs visible

### Test Cases:
```
TC8.1: Create AI agent with basic config
TC8.2: Set GPT-4 model
TC8.3: Write agent instructions
TC8.4: Define input parameters
TC8.5: Test agent with sample input
TC8.6: Activate agent
TC8.7: Trigger agent from workflow
TC8.8: View execution results
TC8.9: Edit agent configuration
TC8.10: Deactivate agent
```

### Files to Check:
- AI agent configuration pages
- Model integration service
- Prompt management
- Agent execution engine
- GraphQL: AI agent mutations

### Status: ⚠️ **CHECK IMPLEMENTATION** - May need backend integration

---

## WORKFLOW 9: Configure Workspace Settings

**Priority:** 🟡 HIGH
**Route:** `/settings/workspace`
**Component:** Workspace settings pages

### Steps:
1. Navigate to Settings → Workspace
2. Update workspace name
3. Upload workspace logo
4. Set workspace timezone
5. Configure date/time format
6. Set currency preferences
7. Save changes
8. Verify changes reflected across app

### Expected Behavior:
- ✅ Workspace settings page loads
- ✅ Name input editable
- ✅ Logo upload works
- ✅ Timezone dropdown populated
- ✅ Format options selectable
- ✅ Currency dropdown works
- ✅ Save updates workspace metadata
- ✅ Changes visible immediately

### Test Cases:
```
TC9.1: Update workspace name
TC9.2: Upload workspace logo
TC9.3: Change timezone
TC9.4: Set date format
TC9.5: Set currency
TC9.6: Save and verify changes
TC9.7: Check logo displays in header
TC9.8: Verify timezone in timestamps
```

### Files to Check:
- SettingsWorkspace.tsx
- Workspace metadata management
- Logo upload service
- GraphQL: updateWorkspace

---

## WORKFLOW 10: Set Up User Roles and Permissions

**Priority:** 🔴 CRITICAL (Security)
**Route:** `/settings/workspace-members/roles`
**Component:** Role management pages

### Steps:
1. Navigate to Settings → Roles
2. Click "Create Role"
3. Name role (e.g., "Sales Rep")
4. Set role description
5. Configure object permissions (People, Companies, etc.)
6. Set field-level permissions (read/write/none)
7. Configure feature access (Workflows, Settings, etc.)
8. Save role
9. Assign role to user
10. Test user access with new role

### Expected Behavior:
- ✅ Roles page loads
- ✅ Create modal opens
- ✅ Permission matrix displays
- ✅ Checkboxes toggle permissions
- ✅ Save creates role record
- ✅ Role appears in user assignment dropdown
- ✅ User permissions enforced
- ✅ Unauthorized access blocked

### Test Cases:
```
TC10.1: Create "Sales" role
TC10.2: Grant read access to People
TC10.3: Grant write access to Opportunities
TC10.4: Deny access to Settings
TC10.5: Save role
TC10.6: Assign role to user
TC10.7: Login as user and verify permissions
TC10.8: Attempt unauthorized action (should fail)
TC10.9: Edit existing role
TC10.10: Delete unused role
```

### Files to Check:
- Role management components
- Permission matrix UI
- Authorization middleware
- GraphQL: createRole, updateRole
- Backend: permission enforcement

---

## WORKFLOW 11: Configure API Keys and Integrations

**Priority:** 🟡 HIGH
**Route:** `/settings/developers/api-keys`
**Component:** API key management

### Steps:
1. Navigate to Settings → Developers → API Keys
2. Click "Create API Key"
3. Name API key (e.g., "Zapier Integration")
4. Set expiration date (optional)
5. Configure scopes/permissions
6. Generate key
7. Copy key to clipboard
8. Save key securely
9. Test API key with request
10. Revoke key when needed

### Expected Behavior:
- ✅ API Keys page loads
- ✅ Create form opens
- ✅ Name input works
- ✅ Date picker for expiration
- ✅ Scope checkboxes available
- ✅ Key generated on save
- ✅ Copy button copies to clipboard
- ✅ Key displayed once (security)
- ✅ Test endpoint validates key
- ✅ Revoke immediately disables key

### Test Cases:
```
TC11.1: Create API key with name
TC11.2: Set expiration date
TC11.3: Select read-only scope
TC11.4: Generate key
TC11.5: Copy key to clipboard
TC11.6: Test API request with key
TC11.7: Verify scope enforcement
TC11.8: Revoke key
TC11.9: Verify revoked key fails
TC11.10: Create key with full access
```

### Files to Check:
- API key management pages
- Key generation service
- Scope configuration
- GraphQL: createApiKey, revokeApiKey
- Backend: API authentication middleware

---

## WORKFLOW 12: Set Up SSO Authentication

**Priority:** 🟢 MEDIUM (Enterprise Feature)
**Route:** `/settings/security/sso`
**Component:** SSO configuration

### Steps:
1. Navigate to Settings → Security → SSO
2. Select SSO provider (Google, Okta, etc.)
3. Enter provider configuration (Client ID, Secret)
4. Set callback URL
5. Configure user attribute mapping
6. Test SSO connection
7. Enable SSO for workspace
8. Disable password login (optional)
9. Test login with SSO
10. Monitor SSO logins

### Expected Behavior:
- ✅ SSO settings page loads
- ✅ Provider dropdown populated
- ✅ Configuration form displays
- ✅ Callback URL auto-generated
- ✅ Attribute mapping fields available
- ✅ Test button validates connection
- ✅ Enable toggle activates SSO
- ✅ Login page shows SSO button
- ✅ SSO login redirects correctly
- ✅ User attributes synced

### Test Cases:
```
TC12.1: Select Google as provider
TC12.2: Enter Client ID and Secret
TC12.3: Configure attribute mapping
TC12.4: Test SSO connection
TC12.5: Enable SSO
TC12.6: Logout and test SSO login
TC12.7: Verify user attributes synced
TC12.8: Disable password login
TC12.9: Test that password login disabled
TC12.10: Monitor SSO audit logs
```

### Files to Check:
- SSO configuration pages
- Provider integration modules
- OAuth callback handlers
- Attribute mapping logic
- GraphQL: configureSso, testSsoConnection

---

## WORKFLOW 13: Create and Use Custom Objects

**Priority:** 🔴 CRITICAL (Core Feature)
**Route:** `/settings/objects/new`
**Component:** Custom object builder

### Steps:
1. Navigate to Settings → Objects
2. Click "Create Object"
3. Name object (e.g., "Project")
4. Set plural name and description
5. Add fields (Text, Number, Date, Relation, etc.)
6. Configure field properties (required, unique, etc.)
7. Set up relationships to other objects
8. Create custom views (Table, Kanban, Calendar)
9. Save object
10. Navigate to new object page
11. Create record in custom object
12. Test all field types

### Expected Behavior:
- ✅ Objects settings page loads
- ✅ Create wizard opens
- ✅ Name validation works
- ✅ Field builder displays
- ✅ All field types available
- ✅ Relation builder works
- ✅ View configuration saves
- ✅ Object appears in navigation
- ✅ Can create records
- ✅ All field types work correctly

### Test Cases:
```
TC13.1: Create "Project" object
TC13.2: Add text field "Project Name"
TC13.3: Add number field "Budget"
TC13.4: Add date field "Start Date"
TC13.5: Add relation to Company
TC13.6: Create table view
TC13.7: Create kanban view by status
TC13.8: Save object
TC13.9: Navigate to Projects page
TC13.10: Create first project record
TC13.11: Verify all fields work
TC13.12: Test relationship to company
```

### Files to Check:
- Custom object builder
- Field type components
- Relation builder
- View configuration
- Metadata sync service
- GraphQL: createObject, createObjectField

---

## WORKFLOW 14: Import Data from CSV

**Priority:** 🟡 HIGH
**Route:** `/settings/data-import` or object import button
**Component:** Data import wizard

### Steps:
1. Navigate to data import
2. Select object to import into (People, Companies, etc.)
3. Upload CSV file
4. Map CSV columns to object fields
5. Preview import data
6. Validate data (check for errors)
7. Configure import options (skip duplicates, etc.)
8. Start import
9. Monitor import progress
10. Review import results
11. Handle any errors

### Expected Behavior:
- ✅ Import page loads
- ✅ Object selector works
- ✅ File upload accepts CSV
- ✅ Column mapping interface displays
- ✅ Auto-mapping suggests fields
- ✅ Preview shows sample records
- ✅ Validation catches errors
- ✅ Options configure behavior
- ✅ Import processes records
- ✅ Progress bar updates
- ✅ Results summary shown
- ✅ Errors downloadable

### Test Cases:
```
TC14.1: Select People object
TC14.2: Upload CSV with 10 people
TC14.3: Map CSV columns to fields
TC14.4: Preview first 5 records
TC14.5: Validate data (check emails)
TC14.6: Enable "skip duplicates"
TC14.7: Start import
TC14.8: Monitor progress
TC14.9: Review success count
TC14.10: Download error report
TC14.11: Import with duplicate emails
TC14.12: Verify duplicates skipped
```

### Files to Check:
- Import wizard components
- CSV parser
- Column mapping UI
- Validation logic
- Import processing service
- GraphQL: importRecords, getImportStatus

---

## WORKFLOW 15: Export Data and Reports

**Priority:** 🟡 HIGH
**Route:** Export button on object pages
**Component:** Export functionality

### Steps:
1. Navigate to any object page (People, Companies, etc.)
2. Apply filters to data (optional)
3. Click "Export" button
4. Select export format (CSV, Excel, PDF)
5. Choose fields to include
6. Configure export options
7. Generate export file
8. Download file
9. Verify exported data

### Expected Behavior:
- ✅ Export button visible
- ✅ Format selector appears
- ✅ Field selector populated
- ✅ Options configurable
- ✅ Export generates file
- ✅ Download link provided
- ✅ File contains correct data
- ✅ Filters applied to export
- ✅ All selected fields included

### Test Cases:
```
TC15.1: Export all people to CSV
TC15.2: Filter people by company
TC15.3: Export filtered results
TC15.4: Export to Excel format
TC15.5: Select specific fields only
TC15.6: Export with custom field order
TC15.7: Verify CSV file structure
TC15.8: Open in Excel and check data
TC15.9: Export opportunities to PDF
TC15.10: Export with date range filter
```

### Files to Check:
- Export button components
- Export wizard
- Format generators (CSV, Excel, PDF)
- Filter application logic
- Download service

---

## WORKFLOW 16: Configure Email Sync

**Priority:** 🟢 MEDIUM
**Route:** `/settings/accounts/emails`
**Component:** Email account settings

### Steps:
1. Navigate to Settings → Accounts → Emails
2. Click "Connect Email Account"
3. Select email provider (Gmail, Outlook, etc.)
4. Authenticate with OAuth
5. Grant permissions to Twenty
6. Configure sync settings (folders to sync)
7. Set sync frequency
8. Enable auto-linking to contacts
9. Start initial sync
10. Verify emails appear in Twenty
11. Test email sending from Twenty

### Expected Behavior:
- ✅ Email accounts page loads
- ✅ Connect button works
- ✅ OAuth flow completes
- ✅ Permissions granted
- ✅ Sync settings configurable
- ✅ Frequency dropdown works
- ✅ Auto-linking toggle available
- ✅ Sync starts automatically
- ✅ Emails appear in timeline
- ✅ Can send emails from Twenty

### Test Cases:
```
TC16.1: Connect Gmail account
TC16.2: Complete OAuth flow
TC16.3: Select inbox folder
TC16.4: Set sync frequency to 15 min
TC16.5: Enable auto-linking
TC16.6: Start sync
TC16.7: Verify emails imported
TC16.8: Check email linked to contact
TC16.9: Send email from Twenty
TC16.10: Verify email sent successfully
```

### Files to Check:
- Email account configuration
- OAuth integration
- Email sync service
- Auto-linking logic
- Email sending service

---

## WORKFLOW 17: Set Up Webhook Integrations

**Priority:** 🟢 MEDIUM
**Route:** `/settings/developers/webhooks`
**Component:** Webhook management

### Steps:
1. Navigate to Settings → Developers → Webhooks
2. Click "Create Webhook"
3. Enter webhook URL
4. Select trigger events (person.created, etc.)
5. Configure payload format
6. Set authentication (secret, headers)
7. Test webhook delivery
8. Activate webhook
9. Monitor webhook deliveries
10. Handle failed deliveries

### Expected Behavior:
- ✅ Webhooks page loads
- ✅ Create form opens
- ✅ URL validation works
- ✅ Event checkboxes available
- ✅ Payload format configurable
- ✅ Auth settings work
- ✅ Test sends sample payload
- ✅ Activation enables webhook
- ✅ Deliveries logged
- ✅ Retry logic for failures

### Test Cases:
```
TC17.1: Create webhook with URL
TC17.2: Select "person.created" event
TC17.3: Configure JSON payload
TC17.4: Set webhook secret
TC17.5: Test webhook delivery
TC17.6: Activate webhook
TC17.7: Create person and verify webhook sent
TC17.8: Check delivery logs
TC17.9: Simulate failure and check retry
TC17.10: Edit webhook configuration
```

### Files to Check:
- Webhook management pages
- Event subscription logic
- Payload generation
- Delivery service
- Retry mechanism
- GraphQL: createWebhook, updateWebhook

---

## WORKFLOW 18: Manage Billing and Subscription

**Priority:** 🟢 MEDIUM (Enterprise)
**Route:** `/settings/billing`
**Component:** Billing management

### Steps:
1. Navigate to Settings → Billing
2. View current plan details
3. Click "Upgrade Plan"
4. Select new plan tier
5. Enter payment information
6. Apply coupon code (if available)
7. Review billing summary
8. Confirm upgrade
9. Verify plan activated
10. View invoice history
11. Update payment method

### Expected Behavior:
- ✅ Billing page loads
- ✅ Current plan displayed
- ✅ Upgrade options shown
- ✅ Payment form works
- ✅ Coupon validation works
- ✅ Billing summary accurate
- ✅ Stripe checkout completes
- ✅ Plan updated immediately
- ✅ Invoice history visible
- ✅ Payment method updatable

### Test Cases:
```
TC18.1: View current plan
TC18.2: Click upgrade to Pro
TC18.3: Enter credit card info
TC18.4: Apply valid coupon
TC18.5: Review pricing with discount
TC18.6: Complete payment
TC18.7: Verify Pro features enabled
TC18.8: Download invoice
TC18.9: Update payment method
TC18.10: View usage metrics
```

### Files to Check:
- Billing management pages
- Stripe integration
- Plan configuration
- Invoice generation
- Usage tracking

---

## WORKFLOW 19: Configure Workspace Domains

**Priority:** 🟢 MEDIUM (Enterprise)
**Route:** `/settings/security/domains`
**Component:** Domain management

### Steps:
1. Navigate to Settings → Security → Domains
2. Click "Add Domain"
3. Enter custom domain (e.g., crm.company.com)
4. Generate verification DNS record
5. Add DNS record to domain provider
6. Verify domain ownership
7. Configure SSL certificate
8. Set domain as primary
9. Test access via custom domain
10. Configure email domain for sending

### Expected Behavior:
- ✅ Domains page loads
- ✅ Add form opens
- ✅ Domain validation works
- ✅ DNS record generated
- ✅ Verification instructions clear
- ✅ Verification check succeeds
- ✅ SSL auto-configured
- ✅ Primary domain settable
- ✅ Custom domain accessible
- ✅ Email sending works

### Test Cases:
```
TC19.1: Enter custom domain
TC19.2: Generate DNS verification record
TC19.3: Add DNS record (manual step)
TC19.4: Verify domain ownership
TC19.5: Configure SSL
TC19.6: Set as primary domain
TC19.7: Access via custom domain
TC19.8: Test login via custom domain
TC19.9: Configure email sending domain
TC19.10: Send test email from custom domain
```

### Files to Check:
- Domain management pages
- DNS verification service
- SSL configuration
- Domain routing
- Email domain setup

---

## WORKFLOW 20: Set Up Database Connections (Remote Schemas)

**Priority:** 🟢 MEDIUM (Advanced)
**Route:** `/settings/integrations/databases`
**Component:** Database connection management

### Steps:
1. Navigate to Settings → Integrations → Databases
2. Click "Add Database Connection"
3. Select database type (PostgreSQL, MySQL, etc.)
4. Enter connection details (host, port, database name)
5. Enter credentials (username, password)
6. Test connection
7. Select tables to sync
8. Map table columns to Twenty fields
9. Configure sync schedule
10. Enable connection
11. Monitor sync status
12. Query remote data in Twenty

### Expected Behavior:
- ✅ Databases page loads
- ✅ Add form opens
- ✅ Database type dropdown works
- ✅ Connection form validates
- ✅ Test connection succeeds
- ✅ Table list fetched
- ✅ Column mapping works
- ✅ Sync schedule configurable
- ✅ Connection activates
- ✅ Sync runs on schedule
- ✅ Remote data queryable

### Test Cases:
```
TC20.1: Select PostgreSQL database
TC20.2: Enter connection details
TC20.3: Test connection
TC20.4: Select "customers" table
TC20.5: Map columns to Person fields
TC20.6: Set hourly sync
TC20.7: Enable connection
TC20.8: Trigger manual sync
TC20.9: Verify data imported
TC20.10: Query remote data
TC20.11: Update remote record
TC20.12: Verify sync updates
```

### Files to Check:
- Database connection pages
- Connection test service
- Table introspection
- Column mapping UI
- Sync scheduler
- Remote query service

---

## Testing Methodology

### Phase 1: Manual UI Testing (Using Playwright)
1. Start development server: `yarn start`
2. Open Playwright browser
3. Execute each workflow step-by-step
4. Document successes and failures
5. Capture screenshots of errors
6. Log console errors

### Phase 2: Automated Testing
1. Create Playwright test scripts for each workflow
2. Run tests in CI/CD pipeline
3. Generate test reports
4. Identify regression issues

### Phase 3: Fix Implementation
1. Prioritize critical (🔴) workflows first
2. Fix broken components systematically
3. Verify fixes with tests
4. Document fixes in commit messages

### Phase 4: End-to-End Verification
1. Run all 20 workflows in sequence
2. Verify data persistence
3. Check cross-workflow integration
4. Performance testing
5. User acceptance testing

---

## Success Criteria

### For Each Workflow:
- ✅ All steps complete without errors
- ✅ Data persists correctly to database
- ✅ UI responds as expected
- ✅ No console errors
- ✅ Proper error handling for invalid inputs
- ✅ Loading states work correctly
- ✅ Navigation flows smoothly

### Overall Success:
- ✅ 20/20 workflows fully functional
- ✅ Zero blocking bugs
- ✅ All critical features operational
- ✅ Performance acceptable (<3s page loads)
- ✅ Mobile responsive (if applicable)

---

## Next Steps

1. ✅ **Documentation Complete** - All 20 workflows documented
2. ⏳ **Start Testing** - Begin systematic testing with Playwright
3. ⏳ **Identify Failures** - Document all broken functionality
4. ⏳ **Implement Fixes** - Fix issues systematically
5. ⏳ **Verify All Workflows** - Run complete end-to-end tests

---

**Document Status:** READY FOR TESTING PHASE
**Estimated Testing Time:** 4-6 hours
**Estimated Fix Time:** 8-16 hours (depending on issues found)
