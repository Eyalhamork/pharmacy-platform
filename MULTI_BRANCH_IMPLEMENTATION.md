# Multi-Branch Implementation Checklist
## PharmaCare - Nationwide Operations

**Project Goal:** Transform the single-location pharmacy platform into a comprehensive multi-branch system supporting nationwide pharmacy operations.

**Estimated Timeline:** 4-6 weeks  
**Last Updated:** January 7, 2026

---

## 📋 Table of Contents
1. [Phase 1: Database & Backend Foundation](#phase-1-database--backend-foundation)
2. [Phase 2: Branch Management System](#phase-2-branch-management-system)
3. [Phase 3: Inventory & Product Management](#phase-3-inventory--product-management)
4. [Phase 4: Order Routing & Fulfillment](#phase-4-order-routing--fulfillment)
5. [Phase 5: Staff & Access Control](#phase-5-staff--access-control)
6. [Phase 6: Customer Experience](#phase-6-customer-experience)
7. [Phase 7: Reporting & Analytics](#phase-7-reporting--analytics)
8. [Phase 8: Testing & Deployment](#phase-8-testing--deployment)

---

## Phase 1: Database & Backend Foundation
**Timeline:** Week 1 (Days 1-5)  
**Priority:** 🔴 Critical

### 1.1 Database Schema Updates

- [ ] **Create `branches` table**
  ```sql
  - id (uuid, primary key)
  - name (text) - e.g., "Lucky Pharmacy - Monrovia Central"
  - code (text, unique) - e.g., "LP-MON-001"
  - address (text)
  - city (text)
  - county (text)
  - phone (text)
  - whatsapp (text)
  - email (text)
  - latitude (decimal)
  - longitude (decimal)
  - is_active (boolean)
  - is_headquarters (boolean)
  - operating_hours (jsonb)
  - created_at (timestamp)
  - updated_at (timestamp)
  ```

- [ ] **Create `branch_inventory` table**
  ```sql
  - id (uuid, primary key)
  - branch_id (uuid, foreign key -> branches)
  - product_id (uuid, foreign key -> products)
  - stock_quantity (integer)
  - reorder_level (integer)
  - last_restocked_at (timestamp)
  - created_at (timestamp)
  - updated_at (timestamp)
  ```

- [ ] **Create `delivery_zones` table**
  ```sql
  - id (uuid, primary key)
  - branch_id (uuid, foreign key -> branches)
  - zone_name (text) - e.g., "Sinkor Area"
  - county (text)
  - areas_covered (text[]) - array of neighborhoods
  - delivery_fee (decimal)
  - estimated_delivery_time (text) - e.g., "2-4 hours"
  - is_active (boolean)
  - created_at (timestamp)
  ```

- [ ] **Create `branch_transfers` table**
  ```sql
  - id (uuid, primary key)
  - from_branch_id (uuid, foreign key -> branches)
  - to_branch_id (uuid, foreign key -> branches)
  - product_id (uuid, foreign key -> products)
  - quantity (integer)
  - status (text) - pending, in_transit, completed, cancelled
  - requested_by (uuid, foreign key -> staff)
  - approved_by (uuid, foreign key -> staff)
  - notes (text)
  - created_at (timestamp)
  - completed_at (timestamp)
  ```

- [ ] **Update `staff` table**
  ```sql
  - Add: branch_id (uuid, foreign key -> branches)
  - Add: can_manage_multiple_branches (boolean)
  - Add: assigned_branches (uuid[]) - for regional managers
  ```

- [ ] **Update `orders` table**
  ```sql
  - Add: fulfillment_branch_id (uuid, foreign key -> branches)
  - Add: delivery_zone_id (uuid, foreign key -> delivery_zones)
  - Add: branch_notes (text)
  ```

### 1.2 Row Level Security (RLS) Policies

- [ ] **Set up RLS for `branches` table**
  - Public can view active branches
  - Only admins can create/update/delete

- [ ] **Set up RLS for `branch_inventory` table**
  - Staff can view inventory for their assigned branch(es)
  - Managers can update inventory for their branch
  - Admins have full access

- [ ] **Set up RLS for `delivery_zones` table**
  - Public can view active zones
  - Branch managers can update their zones
  - Admins have full access

- [ ] **Set up RLS for `branch_transfers` table**
  - Staff can view transfers involving their branch
  - Managers can create and approve transfers
  - Admins have full access

### 1.3 Database Functions & Triggers

- [ ] **Create function: `get_nearest_branch(latitude, longitude)`**
  - Calculate distance using Haversine formula
  - Return nearest active branch

- [ ] **Create function: `check_product_availability(product_id, branch_id)`**
  - Check stock levels
  - Return availability status

- [ ] **Create trigger: `update_branch_inventory_timestamp`**
  - Auto-update `updated_at` on inventory changes

- [ ] **Create function: `get_branch_stock_summary(branch_id)`**
  - Return total products, low stock items, out of stock count

---

## Phase 2: Branch Management System
**Timeline:** Week 1-2 (Days 6-10)  
**Priority:** 🔴 Critical

### 2.1 Admin Dashboard - Branch Management

- [ ] **Create `/staff/branches` page**
  - List all branches in a table/grid
  - Show: name, code, city, county, status, stock summary
  - Search and filter functionality
  - Sort by name, location, status

- [ ] **Create "Add New Branch" modal/page**
  - Form fields for all branch details
  - Address autocomplete (if possible)
  - Map picker for latitude/longitude
  - Operating hours editor (JSON format)
  - Upload branch image/logo

- [ ] **Create "Edit Branch" modal/page**
  - Pre-filled form with existing data
  - Ability to activate/deactivate branch
  - Mark as headquarters

- [ ] **Create "Branch Details" page (`/staff/branches/[id]`)**
  - Overview: contact info, operating hours, status
  - Inventory summary
  - Recent orders fulfilled
  - Assigned staff list
  - Delivery zones
  - Performance metrics

### 2.2 Branch API Routes

- [ ] **Create `/api/admin/branches` (GET, POST)**
  - GET: List all branches with filters
  - POST: Create new branch

- [ ] **Create `/api/admin/branches/[id]` (GET, PATCH, DELETE)**
  - GET: Fetch branch details
  - PATCH: Update branch information
  - DELETE: Soft delete (set is_active = false)

- [ ] **Create `/api/admin/branches/[id]/inventory` (GET)**
  - Fetch inventory for specific branch
  - Include product details

- [ ] **Create `/api/admin/branches/[id]/stats` (GET)**
  - Return branch statistics
  - Total orders, revenue, stock value

### 2.3 Branch Selection Components

- [ ] **Create `BranchSelector` component**
  - Dropdown to select branch
  - Show branch name, city, status
  - Used in staff dashboard header

- [ ] **Create `BranchCard` component**
  - Display branch info in card format
  - Show address, phone, hours
  - "Get Directions" button (Google Maps link)

---

## Phase 3: Inventory & Product Management
**Timeline:** Week 2 (Days 11-14)  
**Priority:** 🔴 Critical

### 3.1 Branch-Specific Inventory

- [ ] **Update product listing pages**
  - Show stock levels per branch
  - Filter products by branch availability
  - "Available at X branches" indicator

- [ ] **Create `/staff/inventory` page**
  - View inventory for selected branch
  - Show: product, SKU, stock, reorder level, last restocked
  - Bulk update stock levels
  - Export to CSV

- [ ] **Create "Stock Adjustment" modal**
  - Add/remove stock
  - Reason for adjustment (restock, damage, sale, etc.)
  - Auto-update inventory logs

- [ ] **Create "Low Stock Alerts" section**
  - Dashboard widget showing low stock items
  - Filter by branch
  - Quick reorder button

### 3.2 Inter-Branch Transfers

- [ ] **Create `/staff/transfers` page**
  - List all transfer requests
  - Filter by status, branch, date
  - Create new transfer request

- [ ] **Create "New Transfer Request" modal**
  - Select from/to branch
  - Select product and quantity
  - Add notes
  - Submit for approval

- [ ] **Create "Transfer Details" page**
  - View transfer information
  - Approve/reject (for managers)
  - Mark as completed
  - Print transfer slip

### 3.3 Inventory API Routes

- [ ] **Create `/api/staff/inventory` (GET, POST)**
  - GET: Fetch inventory for branch
  - POST: Adjust stock levels

- [ ] **Create `/api/staff/inventory/[productId]` (GET, PATCH)**
  - GET: Fetch product inventory across all branches
  - PATCH: Update stock for specific branch

- [ ] **Create `/api/staff/transfers` (GET, POST)**
  - GET: List transfer requests
  - POST: Create new transfer

- [ ] **Create `/api/staff/transfers/[id]` (GET, PATCH)**
  - GET: Fetch transfer details
  - PATCH: Update status (approve, complete, cancel)

---

## Phase 4: Order Routing & Fulfillment
**Timeline:** Week 3 (Days 15-19)  
**Priority:** 🟡 High

### 4.1 Smart Order Routing

- [ ] **Create order routing logic**
  - Determine fulfillment branch based on:
    - Customer delivery address
    - Product availability
    - Branch capacity
    - Delivery zones

- [ ] **Update checkout flow**
  - Show available branches for pickup
  - Display delivery zones and fees
  - Estimate delivery time based on branch

- [ ] **Create "Branch Assignment" feature**
  - Auto-assign orders to nearest branch with stock
  - Manual override for staff
  - Notification to assigned branch

### 4.2 Branch-Specific Order Management

- [ ] **Update `/staff/orders` page**
  - Filter orders by assigned branch
  - Show only orders for staff's branch (unless admin)
  - Branch column in orders table

- [ ] **Update order details page**
  - Display fulfillment branch
  - Show branch contact info
  - Transfer order to another branch (if needed)

- [ ] **Create "Transfer Order" modal**
  - Select new branch
  - Check stock availability
  - Add reason for transfer
  - Notify customer

### 4.3 Delivery Zone Management

- [ ] **Create `/staff/delivery-zones` page**
  - List zones for selected branch
  - Add/edit/delete zones
  - Set delivery fees and times

- [ ] **Create "Add Delivery Zone" modal**
  - Zone name and coverage areas
  - Delivery fee
  - Estimated delivery time
  - Active/inactive toggle

- [ ] **Update delivery fee calculation**
  - Use zone-based pricing
  - Show delivery fee during checkout
  - Handle multiple zones (customer selects)

### 4.4 Order Routing API Routes

- [ ] **Create `/api/orders/route` (POST)**
  - Input: customer address, cart items
  - Output: recommended branch, delivery zone, fee

- [ ] **Create `/api/orders/[id]/transfer` (POST)**
  - Transfer order to different branch
  - Update inventory accordingly
  - Send notifications

---

## Phase 5: Staff & Access Control
**Timeline:** Week 3-4 (Days 20-23)  
**Priority:** 🟡 High

### 5.1 Branch-Based Access Control

- [ ] **Update staff authentication**
  - Include branch_id in session
  - Check branch access on protected routes

- [ ] **Create role hierarchy**
  - **Branch Staff:** View/manage orders for their branch only
  - **Branch Manager:** Full control of their branch
  - **Regional Manager:** Manage multiple branches
  - **Admin:** Full system access

- [ ] **Update middleware**
  - Verify branch access for API routes
  - Redirect staff to their branch dashboard

### 5.2 Staff Assignment

- [ ] **Update `/staff/settings` or create `/admin/staff-management`**
  - Assign staff to branches
  - Set branch permissions
  - Manage regional managers

- [ ] **Create "Assign Staff to Branch" modal**
  - Select staff member
  - Select branch(es)
  - Set role and permissions

- [ ] **Update staff profile page**
  - Show assigned branch(es)
  - Branch contact info
  - Switch between branches (for regional managers)

### 5.3 Branch-Specific Dashboards

- [ ] **Update `/staff/dashboard`**
  - Show metrics for staff's assigned branch
  - Branch selector for regional managers/admins
  - Branch-specific quick actions

- [ ] **Create branch performance widgets**
  - Today's orders
  - Low stock alerts
  - Pending prescriptions
  - Revenue (today, week, month)

---

## Phase 6: Customer Experience
**Timeline:** Week 4 (Days 24-26)  
**Priority:** 🟡 High

### 6.1 Branch Locator

- [ ] **Create `/branches` or `/locations` page**
  - List all active branches
  - Search by county/city
  - Map view with markers
  - "Get Directions" links

- [ ] **Create `BranchLocator` component**
  - Interactive map (Google Maps or Mapbox)
  - Branch cards with details
  - Filter by county
  - "Find Nearest Branch" button (use geolocation)

- [ ] **Add branch info to footer**
  - Link to locations page
  - Show number of branches
  - "Serving all 15 counties" message

### 6.2 Product Availability

- [ ] **Update product pages**
  - "Check availability at other branches" button
  - Show stock status per branch
  - "Reserve at branch" option (for pickup)

- [ ] **Create "Branch Availability" modal**
  - List branches with stock
  - Show quantity available
  - Distance from customer (if location shared)
  - "Select for pickup" button

### 6.3 Pickup Options

- [ ] **Update checkout delivery step**
  - "Pickup from branch" option
  - Select branch from list
  - Show branch address and hours
  - Estimated ready time

- [ ] **Create pickup confirmation**
  - Email/SMS with branch details
  - Pickup code/QR code
  - Directions to branch

### 6.4 Customer API Routes

- [ ] **Create `/api/branches` (GET)**
  - Public endpoint for branch list
  - Filter by county, active status

- [ ] **Create `/api/branches/nearest` (POST)**
  - Input: latitude, longitude
  - Output: nearest branches with distance

- [ ] **Create `/api/products/[id]/availability` (GET)**
  - Show stock across all branches
  - Include branch details

---

## Phase 7: Reporting & Analytics
**Timeline:** Week 4-5 (Days 27-30)  
**Priority:** 🟢 Medium

### 7.1 Branch Performance Reports

- [ ] **Create `/staff/reports/branches` page**
  - Compare performance across branches
  - Metrics: orders, revenue, avg order value
  - Date range selector
  - Export to PDF/Excel

- [ ] **Create branch comparison charts**
  - Bar chart: Revenue by branch
  - Line chart: Orders over time
  - Pie chart: Market share by branch

### 7.2 Inventory Reports

- [ ] **Create `/staff/reports/inventory` page**
  - Stock levels across branches
  - Low stock items
  - Inventory turnover rate
  - Dead stock identification

- [ ] **Create inventory alerts**
  - Email notifications for low stock
  - Daily/weekly inventory summary
  - Transfer recommendations

### 7.3 Regional Analytics

- [ ] **Create regional dashboard (for regional managers)**
  - Overview of assigned branches
  - Comparative metrics
  - Top-performing branches
  - Issues requiring attention

- [ ] **Create county-level reports**
  - Sales by county
  - Customer distribution
  - Delivery performance

### 7.4 Reporting API Routes

- [ ] **Create `/api/reports/branches` (GET)**
  - Branch performance data
  - Date range filtering

- [ ] **Create `/api/reports/inventory` (GET)**
  - Inventory summary across branches

- [ ] **Create `/api/reports/regional` (GET)**
  - Regional performance metrics

---

## Phase 8: Testing & Deployment
**Timeline:** Week 5-6 (Days 31-40)  
**Priority:** 🔴 Critical

### 8.1 Data Migration

- [ ] **Create seed data for branches**
  - Add all Lucky Pharmacy branches
  - Include accurate addresses, contacts
  - Set up delivery zones

- [ ] **Migrate existing inventory**
  - Assign products to branches
  - Set initial stock levels
  - Create reorder levels

- [ ] **Assign existing staff to branches**
  - Update staff records with branch_id
  - Set appropriate roles

- [ ] **Update existing orders**
  - Assign to appropriate branches
  - Backfill branch data where possible

### 8.2 Testing

- [ ] **Unit tests**
  - Branch CRUD operations
  - Inventory management functions
  - Order routing logic

- [ ] **Integration tests**
  - Multi-branch order flow
  - Stock transfer process
  - Branch-based access control

- [ ] **User acceptance testing (UAT)**
  - Test with actual staff from different branches
  - Verify workflows match real operations
  - Collect feedback

- [ ] **Performance testing**
  - Load test with multiple branches
  - Optimize database queries
  - Test with realistic data volumes

### 8.3 Documentation

- [ ] **Update README.md**
  - Document multi-branch features
  - Add setup instructions

- [ ] **Create admin guide**
  - How to add/manage branches
  - Staff assignment procedures
  - Inventory management best practices

- [ ] **Create staff training materials**
  - Branch-specific workflows
  - How to use new features
  - Video tutorials (optional)

- [ ] **Update API documentation**
  - Document new endpoints
  - Include examples

### 8.4 Deployment

- [ ] **Staging deployment**
  - Deploy to staging environment
  - Test with production-like data
  - Verify all features work

- [ ] **Production deployment**
  - Run database migrations
  - Deploy application
  - Monitor for errors

- [ ] **Post-deployment verification**
  - Check all branches are accessible
  - Verify order routing works
  - Test from different user roles

- [ ] **Rollback plan**
  - Document rollback procedures
  - Keep backup of previous version
  - Monitor for issues in first 48 hours

---

## 🎯 Success Metrics

### Technical Metrics
- [ ] All branches visible in admin dashboard
- [ ] Orders correctly routed to appropriate branches
- [ ] Inventory accurately tracked per branch
- [ ] Staff can only access their assigned branch data
- [ ] Page load times < 3 seconds
- [ ] Zero critical bugs in production

### Business Metrics
- [ ] All X branches onboarded successfully
- [ ] Staff trained and using the system
- [ ] Orders fulfilled from correct branches
- [ ] Inventory transfers tracked properly
- [ ] Customer satisfaction with branch selection

---

## 📝 Notes & Considerations

### Technical Decisions
- **Geolocation:** Consider using browser geolocation API for "Find Nearest Branch"
- **Maps:** Google Maps API (paid) vs Mapbox (free tier) vs OpenStreetMap
- **Real-time Updates:** Consider WebSockets for live inventory updates
- **Caching:** Implement Redis for branch data caching

### Business Considerations
- **Branch Codes:** Establish naming convention (e.g., LP-MON-001)
- **Inventory Sync:** Decide on sync frequency (real-time vs batch)
- **Transfer Approval:** Define approval workflow (auto vs manual)
- **Pricing:** Branch-specific pricing or nationwide standard?

### Future Enhancements
- [ ] Mobile app for branch staff
- [ ] Barcode scanning for inventory
- [ ] Automated reordering based on sales velocity
- [ ] Customer branch preferences
- [ ] Branch-specific promotions
- [ ] Franchise management (if applicable)

---

## 🚀 Quick Start Guide

### For Developers
1. Start with Phase 1: Database schema
2. Create seed data for 2-3 test branches
3. Implement branch management UI
4. Test with sample orders
5. Gradually roll out to other phases

### For Project Managers
1. Review and prioritize checklist items
2. Assign tasks to team members
3. Set up weekly progress reviews
4. Coordinate with Lucky Pharmacy stakeholders
5. Plan staff training sessions

---

**Last Updated:** January 7, 2026  
**Version:** 1.0  
**Maintained by:** Development Team
