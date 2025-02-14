

1. The Central Hub – Organization
Organization
Purpose: Represents a single security system (e.g., a society or business).
Key Relations:
Owner: An admin user (stored in the User model) who creates the organization.
Members: Other users who join the organization through a unique join link/password (managed via the OrganizationMember join table).
Guards: The security personnel that belong to the organization (stored in the Guard model).
Shifts, Alerts, Reviews, ChatMessages, Background Check Requests: All operational data tied to a specific organization.
2. Users and Their Roles
User

Purpose: Represents people who interact with the system (admins, members, police).
Key Relations:
OwnedOrganizations: Organizations the user has created (as an admin).
Memberships: Organizations the user belongs to (via OrganizationMember).
Sent Alerts & Chat: They can trigger alerts and send chat messages.
Background Check Requests & Reviews: Users can request background checks on guards or review them.
OrganizationMember

Purpose: A join table linking users to organizations.
Key Points:
Each record shows that a particular user is a member of a particular organization.
3. Guards – The Security Personnel
Guard

Purpose: Represents security guards managed by an organization.
Key Relations:
Belongs to an Organization: Only admins can add guards to an organization.
Personal Info: Each guard has a one-to-one relation with GuardPersonalInfo (which stores detailed personal data like height, weight, residence, past work history, and current deployment).
Location History: A guard may have many location records (stored in GuardLocationHistory) that track where they were at different times.
ShiftAssignments: Guards are assigned to shifts (via ShiftAssignment).
Attendances, Reviews, ChatMessages, Background Check Requests: Other operational details like check-ins, ratings, and communications.
GuardPersonalInfo

Purpose: Holds all the detailed personal information of a guard (date of birth, physical stats, contact, residence, past work history, current deployment, etc.).
GuardLocationHistory

Purpose: Stores historical location data for a guard.
Key Points:
Each record includes latitude, longitude, and a timestamp.
Optionally linked to a shift if the location was recorded during a specific shift.
4. Shifts and Guard Assignments
Shift

Purpose: Defines a time period during which guards are on duty within an organization.
Key Relations:
Belongs to an Organization.
ShiftAssignments: Determines which guards are assigned to that shift.
Attendances: Records of guard check-ins and check-outs.
Location Histories: Optionally aggregates location history records that are linked to the shift.
ShiftAssignment

Purpose: Links a guard to a shift and sets operational parameters for that assignment.
Additional Feature:
Geofence Data: Includes fields for allowedLatitude, allowedLongitude, and allowedRadius, defining the circular area the guard must remain within. If the guard goes outside this area, an alert can be triggered.
Attendance

Purpose: Tracks the check-in and check-out times for a guard (optionally linked to a specific shift).
5. Operational and Communication Models
Alert

Purpose: Used to notify admins (and others) about issues, such as a guard leaving the allowed geofence or unauthorized absences.
Key Relation:
Tied to an organization and optionally to the user who sent the alert.
BackgroundCheckRequest

Purpose: When a user (member or police) requests a background check for a guard.
Key Relations:
Linked to the organization, the target guard, and the requesting user.
Review

Purpose: Allows users to rate and comment on a guard’s performance.
Key Relations:
Each review is linked to a guard, the organization, and the user who submitted it.
ChatMessage

Purpose: Supports in‑app chat among users and between users and guards.
Key Relation:
Each message is linked to an organization and can have a sender that is either a user or a guard (polymorphic relation).
How They All Work Together
At the top level, an Organization is created by an admin. This organization acts as the container for everything: guards, shifts, members, alerts, reviews, etc.

Users interact with the system as admins, members, or police.

Admins manage organizations: adding guards, creating shifts, managing members, approving background checks, etc.
Members (or police, with view-only permissions) can see current shifts, live guard locations, and provide feedback or request background checks.
Guards are managed exclusively by admins and have detailed personal info plus their location history tracked over time.

ShiftAssignments tie a guard to a particular shift, with a geofence to enforce boundaries.
Their Attendance records, Location Histories, and any Reviews from members all contribute to the operational view.
Shifts serve as the time windows during which guards are active. They aggregate guard assignments and attendance records and optionally group related location histories.

Alerts, Background Check Requests, Reviews, and ChatMessages are operational tools that let users and police communicate issues, request verifications, rate performance, and chat in real time—all scoped by organization.