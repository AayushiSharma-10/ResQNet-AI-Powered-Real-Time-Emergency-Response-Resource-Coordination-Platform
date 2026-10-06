# ResQNet API

## Auth

### POST /api/auth/register
Creates a user and returns a JWT.

### POST /api/auth/login
Authenticates an existing user and returns a JWT plus profile metadata.

### GET /api/auth/me
Returns the authenticated user's profile.

## Incidents

### GET /api/incidents
Returns paginated and filtered incident results.

### POST /api/incidents
Creates a new incident and triggers the AI triage assessment.

### PATCH /api/incidents/:id/dispatch
Dispatches a responder or resource to an active incident.

### PATCH /api/incidents/:id/status
Updates incident status.

## AI

### POST /api/ai/triage
Runs AI-based triage and recommendation generation.

## Resources

### GET /api/resources
Lists available emergency resources.

## Notifications

### GET /api/notifications
Returns user notifications.

## Hospitals

### GET /api/hospitals
Lists hospital profiles and capacity summaries.

## Analytics

### GET /api/analytics
Returns a dashboard snapshot with current operational KPIs.
