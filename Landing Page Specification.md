**Landing Page Specification**

**Page Name**

Landing Page

**Page Purpose**

The landing page serves as the primary entry point for users accessing the platform. It introduces the platform services, highlights promotions, and allows users to quickly navigate to different modules such as food ordering, grocery delivery, home services, and ride booking.

The page should also help the platform promote vendors through advertisements and featured listings.

-----
**Target Users**

- New users 
- Existing users 
- Vendors exploring the platform 
- Customers searching for services 
-----
**Page Layout Structure**

The landing page should be divided into the following sections:

1 Header / Navigation Bar\
2 Location Selection\
3 Hero Banner / Advertisement\
4 Service Selection Cards\
5 Featured Restaurants\
6 Grocery Quick Access\
7 Home Services Section\
8 Ride Booking Quick Access\
9 Promotional Offers\
10 Customer Reviews / Testimonials\
11 App Download Section\
12 Footer

-----
**1 Header / Navigation Bar**

**Purpose**

Provides navigation and access to account-related actions.

**Components**

Logo\
Search Bar\
Location Selector\
Login Button\
Signup Button\
Profile Dropdown (if logged in)\
Cart Icon

**Example Layout**

\---------------------------------------------------\
LOGO | Search services | Location | Login | Signup\
\---------------------------------------------------

**Actions**

Logo → redirects to home page\
Search → opens service search results\
Login → opens login modal\
Signup → opens signup page\
Cart → opens cart page

-----
**2 Location Selection**

**Purpose**

Ensures services are shown based on user location.

**UI Component**

Location selector dropdown

**Data Fields**

latitude\
longitude\
city\
area\
pincode

**Behaviour**

If user location not set:

show "Select Location"

Options:

Use Current Location\
Enter Address Manually\
Saved Addresses

-----
**3 Hero Banner / Advertisement Section**

**Purpose**

Displays promotional offers and marketing campaigns.

**UI Component**

Carousel Banner

**Example**

\-----------------------------------------\
50% OFF on first food order\
Free delivery on groceries\
Ride discounts today\
\-----------------------------------------

**Data Model**

banner\_id\
title\
description\
image\_url\
redirect\_url\
start\_date\
end\_date\
priority

**Behaviour**

Auto rotate every **5 seconds**.

-----
**4 Service Selection Cards**

**Purpose**

Allows users to choose platform services.

**Services**

Food Delivery\
Grocery Delivery\
Home Services\
Bike Taxi\
Auto Taxi

**UI Layout**

[ Food ]\
[ Grocery ]\
[ Home Services ]\
[ Bike Taxi ]\
[ Auto Taxi ]

**Card Data**

service\_id\
service\_name\
icon\
description\
redirect\_url

**Actions**

Clicking card opens corresponding module.

Example:

Food → Restaurant Listing Page\
Grocery → Grocery Store Listing\
Home Services → Services Category Page\
Bike Taxi → Ride Booking Page\
Auto Taxi → Ride Booking Page

-----
**5 Featured Restaurants Section**

**Purpose**

Promotes popular restaurants.

**UI Layout**

Horizontal scroll cards.

**Restaurant Card Fields**

restaurant\_id\
restaurant\_name\
rating\
delivery\_time\
minimum\_order\
image\
cuisine\_type

**Actions**

Click card → open restaurant page.

-----
**6 Grocery Quick Access Section**

**Purpose**

Promotes grocery categories.

**Example Categories**

Vegetables\
Fruits\
Dairy\
Snacks\
Beverages

**UI**

Category cards with images.

**Fields**

category\_id\
category\_name\
icon\
redirect\_url

-----
**7 Home Services Section**

**Purpose**

Show available home services.

**Example Services**

Plumber\
Electrician\
AC Repair\
Car Wash\
Mechanic\
Cleaning

**Service Card Fields**

service\_id\
service\_name\
starting\_price\
rating\
icon

**Action**

Click → Service booking page.

-----
**8 Ride Booking Quick Access**

**Purpose**

Allow quick ride request.

**UI Components**

Pickup Input\
Drop Input\
Vehicle Type Selector

**Vehicle Options**

Bike Taxi\
Auto Taxi

**Button**

Request Ride

-----
**9 Promotional Offers Section**

**Purpose**

Display platform deals.

**Example Offers**

FREEDELIVERY\
50OFF\
FIRSTORDER

**Offer Fields**

coupon\_code\
discount\_type\
discount\_value\
minimum\_order\
expiry\_date

-----
**10 Customer Testimonials**

**Purpose**

Build trust.

**UI**

Customer review cards.

**Fields**

customer\_name\
rating\
review\_text\
profile\_image

-----
**11 App Download Section**

**Purpose**

Encourage mobile app downloads.

**UI**

Buttons:

Download on App Store\
Get it on Google Play

-----
**12 Footer**

**Footer Sections**

Company\
About Us\
Careers\
Contact\
\
Services\
Food\
Grocery\
Rides\
Home Services\
\
Legal\
Privacy Policy\
Terms\
Refund Policy\
\
Support\
Help Center\
Customer Care

**IN short**

1 Landing Page

2 Authentication

3 Customer Home Dashboard

4 Restaurant Listing

5 Restaurant Page

6 Cart

7 Checkout

8 Order Tracking

# **Food Page Specification**
## **Page Name**
Food Listing Page / Restaurant Listing Page
## **Page Purpose**
The Food Page displays all restaurants available near the user's location. It allows users to browse restaurants, filter them based on preferences, and select a restaurant to view its menu and place orders.

The page should provide a fast browsing experience and support multiple filters such as cuisine type, rating, delivery time, and price range.

-----
# **Page URL**
/food

-----
# **Target Users**
- Customers looking to order food 
- Returning users browsing restaurants 
- New users exploring food options 
-----
# **Page Layout Structure**
The page should contain the following sections:

1 Navigation Bar\
2 Location Display\
3 Search Bar\
4 Cuisine Categories\
5 Filters Section\
6 Sort Options\
7 Restaurant Listing Grid\
8 Pagination / Infinite Scroll

-----
# **1 Navigation Bar**
Same navigation bar as Landing Page.
### **Components**
Logo\
Search Bar\
Location Selector\
Cart Icon\
Profile Dropdown

-----
# **2 Location Display**
### **Purpose**
Shows the location used for restaurant discovery.
### **UI**
Delivering to:\
Koramangala, Bangalore\
Change Location
### **Action**
Click **Change Location** → open location selector.

-----
# **3 Search Bar**
### **Purpose**
Allows users to search restaurants or food items.
### **Placeholder**
Search restaurants, dishes, cuisines
### **Behaviour**
Search results may include:

Restaurants\
Food items\
Cuisines
### **Example Queries**
Pizza\
Biryani\
Burger\
Chinese

-----
# **4 Cuisine Categories**
### **Purpose**
Quick filtering based on cuisine.
### **Example Categories**
Indian\
Chinese\
Italian\
Fast Food\
South Indian\
Desserts
### **UI Layout**
Horizontal scrollable category cards.
### **Category Data Model**
category\_id\
category\_name\
category\_icon
### **Action**
Click category → filter restaurant list.

-----
# **5 Filters Section**
### **Purpose**
Helps users narrow down restaurant results.
### **Filters**
#### *Rating Filter*
4\.0+\
3\.5+\
3\.0+

-----
#### *Delivery Time Filter*
Under 30 minutes\
Under 45 minutes\
Under 60 minutes

-----
#### *Price Filter*
₹\
₹₹\
₹₹₹

-----
#### *Veg / Non-Veg Filter*
Veg Only\
Non Veg\
Both

-----
#### *Offers Filter*
Discounts Available\
Free Delivery\
Buy 1 Get 1

-----
### **Filter Data Example**
filter\_type\
filter\_value

-----
# **6 Sort Options**
### **Purpose**
Allows sorting restaurants.
### **Options**
Recommended\
Rating\
Delivery Time\
Cost Low to High\
Cost High to Low

-----
# **7 Restaurant Listing Grid**
### **Purpose**
Displays all restaurants matching filters.
### **UI Layout**
Restaurant cards arranged in grid format.

-----
# **Restaurant Card Components**
Each restaurant card should contain:
### **Restaurant Image**
restaurant\_banner

-----
### **Restaurant Name**
restaurant\_name

Example:

Domino's Pizza\
Burger King\
KFC

-----
### **Rating**
Example:

⭐ 4.3

-----
### **Delivery Time**
30 mins

-----
### **Price for Two**
Example:

₹300 for two

-----
### **Cuisine Types**
Example:

Pizza • Fast Food • Italian

-----
### **Offer Badge**
Example:

50% OFF\
Free Delivery

-----
# **Restaurant Card Data Model**
restaurant\_id\
restaurant\_name\
restaurant\_image\
rating\
delivery\_time\
price\_for\_two\
cuisine\_types\
offer\_badge\
is\_open

-----
# **Restaurant Card Actions**
Clicking the card should open:

Restaurant Menu Page

URL:

/restaurant/{restaurant\_id}

-----
# **Restaurant Availability**
Restaurants must show availability status.
### **Example**
Open\
Closed\
Opens at 10:00 AM

-----
# **8 Pagination / Infinite Scroll**
### **Option 1**
Infinite scroll loading.
### **Option 2**
Pagination.

Example:

Page 1 2 3 4

-----
# **API Endpoints**
### **Get Restaurants**
GET /restaurants

Query Parameters

latitude\
longitude\
page\
limit\
filters\
sort

Example request

GET /restaurants?lat=12.9716&lng=77.5946&page=1

-----
### **Search Restaurants**
GET /restaurants/search

Query

keyword\
location

Example

GET /restaurants/search?q=pizza

-----
### **Get Restaurant Categories**
GET /cuisines

-----
# **Database Tables Used**
restaurants\
restaurant\_images\
restaurant\_categories\
restaurant\_offers\
menu\_items\
reviews

-----
# **Performance Requirements**
Restaurant list should load within:

< 2 seconds

Images should use:

CDN\
Lazy loading

-----
# **Edge Cases**
### **No Restaurants Found**
Show message:

No restaurants available in your area.\
Try changing location.

-----
### **Restaurant Closed**
Restaurant card should show:

Closed\
Opens at 11:00 AM

-----
# **Security Considerations**
- Validate restaurant IDs 
- Prevent API abuse 
- Protect location data 
-----
Next page should logically be:

Restaurant Page (Menu Page)

Ye **Food module ka most complex page hota hai**.

Usme aata hai:

- menu categories 
- add to cart 
- customization 
- combo items 
- veg/nonveg labels 
- ratings 

Agar chaho to main next **Restaurant Menu Page (very detailed)** likh deta hoon — jo actually **Swiggy/Zomato level page** hota hai.

**Grocery Page Specification**

**Page Name**

Grocery Store Listing Page / Grocery Home Page

**Page Purpose**

The Grocery Page allows users to browse grocery stores and products available near their location. It acts as the entry point for grocery shopping, showing nearby stores, categories, and popular products.

Users can filter stores, browse categories, and open a store to add items to their cart.

-----
**Page URL**

/grocery

-----
**Target Users**

- Customers ordering groceries 
- Users browsing daily essentials 
- Returning users reordering grocery items 
-----
**Page Layout Structure**

The grocery page should contain the following sections:

1 Navigation Bar\
2 Location Display\
3 Search Bar\
4 Grocery Categories\
5 Featured Stores\
6 Quick Product Sections\
7 Filters Section\
8 Store Listing Grid\
9 Pagination / Infinite Scroll

-----
**1 Navigation Bar**

Same as Landing Page.

Components:

Logo\
Search Bar\
Location Selector\
Cart Icon\
Profile Dropdown

Cart should display number of items.

Example:

Cart (3)

-----
**2 Location Display**

Shows delivery area.

Example:

Delivering groceries to:\
Indiranagar, Bangalore

Actions:

Change Location\
Use Current Location

-----
**3 Search Bar**

Allows searching grocery items or stores.

Placeholder:

Search groceries, brands, or stores

Example queries:

Milk\
Rice\
Vegetables\
Maggi

Search results may include:

Products\
Stores\
Categories

-----
**4 Grocery Categories**

Allows quick browsing.

Example categories:

Vegetables\
Fruits\
Dairy\
Beverages\
Snacks\
Household\
Personal Care\
Baby Products

UI Layout:

Horizontal scroll cards.

Category Card Fields:

category\_id\
category\_name\
category\_icon\
image

Action:

Click → open category products page.

Example URL:

/grocery/category/{category\_id}

-----
**5 Featured Stores Section**

Shows nearby grocery stores.

Example stores:

Reliance Smart\
More Supermarket\
BigBasket Express\
Local Fresh Mart

Store Card Fields:

store\_id\
store\_name\
store\_logo\
rating\
delivery\_time\
minimum\_order\
delivery\_fee

Example Card Layout:

[ Store Image ]\
Reliance Smart\
⭐ 4.2\
Delivery: 25 mins\
Minimum order ₹200

Action:

Click → open store page.

-----
**6 Quick Product Sections**

Shows frequently purchased items.

Example sections:

Daily Essentials\
Trending Products\
Top Deals\
Fresh Vegetables

Each section displays product cards.

-----
**Product Card Components**

Each product card contains:

Product Image\
Product Name\
Brand\
Weight / Quantity\
Price\
Discount\
Add to Cart Button

Example:

Amul Milk 500ml\
₹28\
ADD

Product Card Fields:

product\_id\
product\_name\
brand\
price\
discount\_price\
quantity\
image\
stock

-----
**Add to Cart Behaviour**

Button:

ADD

After clicking:

\+ 1 -

Quantity selector appears.

Cart updates instantly.

-----
**7 Filters Section**

Allows filtering stores or products.

Filters:

**Delivery Time**

Under 20 minutes\
Under 30 minutes\
Under 45 minutes

-----
**Price Range**

₹\
₹₹\
₹₹₹

-----
**Store Rating**

4\.0+\
3\.5+

-----
**Discounts**

Discount Available\
Free Delivery

-----
**8 Store Listing Grid**

Displays grocery stores matching filters.

Store Card Components:

Store Image\
Store Name\
Rating\
Delivery Time\
Minimum Order\
Delivery Fee\
Offers

Example:

Fresh Mart\
⭐ 4.5\
Delivery: 20 mins\
Min order: ₹100\
10% OFF

-----
**Store Card Data Model**

store\_id\
store\_name\
store\_image\
rating\
delivery\_time\
minimum\_order\
delivery\_fee\
offer\
is\_open

-----
**Store Card Action**

Click → open store product page.

Example URL:

/store/{store\_id}

-----
**9 Pagination / Infinite Scroll**

Option 1:

Infinite Scroll

Option 2:

Page numbers

Example:

Page 1 2 3

-----
**API Endpoints**

**Get Grocery Stores**

GET /grocery/stores

Query Parameters

latitude\
longitude\
page\
limit\
filters\
sort

Example request:

GET /grocery/stores?lat=12.97&lng=77.59&page=1

-----
**Search Products**

GET /grocery/search

Example:

GET /grocery/search?q=milk

-----
**Get Categories**

GET /grocery/categories

-----
**Get Store Products**

GET /store/{store\_id}/products

-----
**Database Tables Used**

stores\
store\_categories\
products\
product\_images\
product\_inventory\
product\_discounts\
reviews\
orders\
order\_items

-----
**Performance Requirements**

Page load time:

< 2 seconds

Images should use:

CDN\
Lazy loading

-----
**Edge Cases**

**Store Closed**

Show:

Closed\
Opens at 8:00 AM

-----
**Product Out of Stock**

Show:

Out of Stock

Disable **Add to Cart** button.

-----
**Security Considerations**

- Validate store IDs 
- Protect price manipulation 
- Secure cart APIs 
-----
Next logical module in PRD should be:

Grocery Store Page (Product Listing Page)

This page includes:

- category sidebar 
- product grid 
- quantity selector 
- cart preview 
- product search

**Home Services Page Specification**

**Page Name**

Home Services Listing Page

**Page Purpose**

The Home Services Page allows users to browse and book professional services such as plumbing, electrical repairs, appliance servicing, cleaning, and vehicle services.

The page displays available service categories, recommended professionals, service packages, and allows users to select a service and schedule a booking.

-----
**Page URL**

/services

-----
**Target Users**

- Customers requiring home services 
- Users booking repairs or maintenance 
- Customers scheduling appointments 
-----
**Page Layout Structure**

The page should contain the following sections:

1 Navigation Bar\
2 Location Display\
3 Search Bar\
4 Service Categories\
5 Featured Services\
6 Popular Service Providers\
7 Service Packages\
8 Filters Section\
9 Service Provider Listing

-----
**1 Navigation Bar**

Same navigation bar used across the platform.

Components:

Logo\
Search Bar\
Location Selector\
Cart / Bookings Icon\
Profile Dropdown

-----
**2 Location Display**

Shows the service availability area.

Example:

Services available in:\
BTM Layout, Bangalore

Actions:

Change Location\
Use Current Location

-----
**3 Search Bar**

Allows searching services.

Placeholder:

Search services like plumber, electrician, AC repair

Example queries:

Plumber\
Electrician\
AC Repair\
Car Wash

Search results may include:

Service Categories\
Service Providers\
Specific Services

-----
**4 Service Categories**

Allows quick navigation.

Example categories:

Plumbing\
Electrical\
AC Repair\
Car Wash\
Bike Repair\
Cleaning Services\
Appliance Repair\
Pest Control\
Painting

-----
**Category Card Layout**

Each card should contain:

Category Icon\
Category Name\
Starting Price

Example:

Plumbing\
Starting ₹199

-----
**Category Data Model**

category\_id\
category\_name\
category\_icon\
starting\_price\
description

-----
**Category Action**

Click category → open category page.

Example:

/services/category/{category\_id}

-----
**5 Featured Services Section**

Displays recommended services.

Example services:

AC Installation\
Bathroom Cleaning\
Car Interior Cleaning\
Washing Machine Repair

Each service card contains:

Service Image\
Service Name\
Price\
Duration\
Rating

Example:

AC Repair\
₹499\
60 minutes\
⭐ 4.6

-----
**Service Card Data Model**

service\_id\
service\_name\
service\_image\
price\
duration\
rating\
category\_id

-----
**6 Popular Service Providers**

Shows top rated workers.

Worker Card Fields:

worker\_id\
worker\_name\
profile\_image\
rating\
experience\_years\
completed\_jobs\
starting\_price

Example:

Ramesh Kumar\
⭐ 4.7\
6 years experience\
300 jobs completed

-----
**7 Service Packages Section**

Shows bundled services.

Example:

Full Bathroom Cleaning\
AC Service + Gas Refill\
Complete Car Wash Package

Package Fields:

package\_id\
package\_name\
services\_included\
price\
duration\
discount

-----
**8 Filters Section**

Users can filter services.

Filters include:

**Rating**

4\.5+\
4\.0+\
3\.5+

-----
**Price Range**

Under ₹200\
₹200-₹500\
₹500+

-----
**Availability**

Available Today\
Available Tomorrow\
Available This Week

-----
**Service Type**

Instant\
Scheduled

-----
**9 Service Provider Listing**

Displays workers available for the selected service.

Worker Card Components:

Worker Image\
Worker Name\
Rating\
Experience\
Price\
Availability\
Book Button

Example:

Rahul Sharma\
⭐ 4.8\
8 years experience\
₹299\
Available Today\
[Book Now]

-----
**Worker Card Data Model**

worker\_id\
worker\_name\
rating\
experience\_years\
jobs\_completed\
price\
availability\
profile\_image

-----
**Booking Action**

Click **Book Now** → open booking page.

Example URL:

/service-booking/{service\_id}

-----
**Booking Fields**

User must select:

Date\
Time Slot\
Address\
Additional Notes

Example time slots:

9 AM - 11 AM\
11 AM - 1 PM\
3 PM - 5 PM

-----
**Booking Data Model**

booking\_id\
user\_id\
service\_id\
worker\_id\
date\
time\_slot\
address\_id\
price\
status\
created\_at

-----
**Booking Status Workflow**

Requested\
Worker Assigned\
Worker On The Way\
Service Started\
Completed\
Cancelled

-----
**API Endpoints**

**Get Service Categories**

GET /services/categories

-----
**Get Services**

GET /services

Query parameters:

category\_id\
location\
filters

-----
**Get Workers**

GET /services/workers

-----
**Create Booking**

POST /services/book

Request example:

{\
` `user\_id\
` `service\_id\
` `worker\_id\
` `date\
` `time\_slot\
` `address\_id\
}

-----
**Database Tables Used**

service\_categories\
services\
workers\
worker\_skills\
service\_packages\
service\_bookings\
reviews

-----
**Performance Requirements**

Page load time:

< 2 seconds

Images must use:

CDN\
Lazy loading

-----
**Edge Cases**

**Worker Not Available**

Show message:

No workers available for selected time.\
Try another slot.

-----
**Service Not Available in Location**

Show:

Service not available in your area.

-----
**Security Considerations**

- Validate worker assignments 
- Protect booking API 
- Prevent fake bookings

**Ride Booking Page Specification**

**Page Name**

Ride Booking Page

**Page Purpose**

The Ride Booking Page allows users to request transportation services such as bike taxi or auto taxi. Users can select pickup and drop locations, view fare estimates, choose vehicle types, and request a ride.

The system then finds the nearest available driver and assigns the ride.

-----
**Page URL**

/rides

-----
**Target Users**

- Customers requesting transportation 
- Users commuting within the city 
- Users needing quick short-distance rides 
-----
**Page Layout Structure**

The Ride Booking page should contain the following components:

1 Navigation Bar\
2 Map Interface\
3 Pickup Location Input\
4 Drop Location Input\
5 Vehicle Type Selector\
6 Fare Estimate Section\
7 Request Ride Button\
8 Ride Status Panel

-----
**1 Navigation Bar**

Components:

Logo\
Location Indicator\
Ride History Button\
Profile Dropdown

-----
**2 Map Interface**

**Purpose**

Displays map for selecting pickup and drop locations.

**Map Features**

User current location marker\
Pickup marker\
Drop marker\
Route line\
Driver markers

**Map APIs**

Google Maps API\
Directions API\
Distance Matrix API

-----
**Map Data Fields**

latitude\
longitude\
route\_distance\
estimated\_time

-----
**3 Pickup Location Input**

**UI**

Pickup Location\
[ Use Current Location ]

**Behaviour**

Options:

Use Current Location\
Choose on Map\
Saved Address\
Recent Locations

-----
**4 Drop Location Input**

**Purpose**

Defines ride destination.

**UI**

Where to?

**Input types**

Address\
Place Name\
Landmark\
Map selection

-----
**Location Data Model**

location\_id\
address\
latitude\
longitude\
city\
pincode

-----
**5 Vehicle Type Selector**

Displays ride options.

**Options**

Bike Taxi\
Auto Taxi

-----
**Vehicle Card Layout**

Each card shows:

Vehicle Icon\
Vehicle Name\
Estimated Arrival Time\
Fare Estimate

Example:

Bike Taxi\
₹85\
Driver arrives in 3 min

-----
**Vehicle Data Model**

vehicle\_type\_id\
vehicle\_name\
base\_fare\
price\_per\_km\
price\_per\_minute\
capacity

-----
**6 Fare Estimate Section**

Shows ride cost estimate.

**Calculation**

fare = base\_fare + (distance × price\_per\_km)

Example:

Base fare: ₹30\
Distance: 5 km\
Price per km: ₹10\
\
Total fare: ₹80

-----
**Fare Data Model**

base\_fare\
distance\
price\_per\_km\
time\_cost\
surge\_multiplier\
estimated\_fare

-----
**7 Request Ride Button**

Button:

Request Ride

**Behaviour**

System performs:

1 Find nearest drivers\
2 Send ride request\
3 Wait for driver acceptance

-----
**Driver Matching Algorithm**

Drivers should be selected based on:

distance from pickup\
driver availability\
driver rating\
vehicle type

Example process:

1 Get drivers within 3km radius\
2 Sort by distance\
3 Send ride request\
4 Assign driver who accepts first

-----
**8 Ride Status Panel**

Once ride is accepted, UI changes to tracking panel.

Displays:

Driver name\
Driver rating\
Vehicle number\
Estimated arrival time\
Call driver button\
Cancel ride button

Example:

Driver: Rahul\
Rating: ⭐4.7\
Vehicle: KA01AB1234\
Arrival: 3 minutes

-----
**Ride Status Workflow**

Ride Requested\
Driver Assigned\
Driver Arriving\
Ride Started\
Ride Completed\
Ride Cancelled

-----
**Ride Tracking Screen**

After ride starts:

Map displays:

Driver location\
Route path\
User location\
Destination

Real-time updates every:

3–5 seconds

-----
**Ride Completion Screen**

Displays:

Final Fare\
Payment Method\
Ride Summary\
Rate Driver

-----
**Rating System**

User can rate driver:

1–5 stars\
Add comment

-----
**API Endpoints**

**Request Ride**

POST /rides/request

Request example:

{\
` `user\_id\
` `pickup\_lat\
` `pickup\_lng\
` `drop\_lat\
` `drop\_lng\
` `vehicle\_type\
}

-----
**Get Ride Status**

GET /rides/{ride\_id}

-----
**Cancel Ride**

POST /rides/{ride\_id}/cancel

-----
**Driver Location Update**

POST /drivers/location

-----
**Database Tables Used**

rides\
drivers\
driver\_locations\
ride\_requests\
ride\_tracking\
payments\
reviews

-----
**Performance Requirements**

Driver assignment time:

< 5 seconds

Location update frequency:

every 3 seconds

-----
**Edge Cases**

**No Drivers Available**

Show message:

No drivers available nearby.\
Try again later.

-----
**Driver Cancels Ride**

System should:

find next available driver

-----
**Security Considerations**

Validate driver identity\
Protect location data\
Prevent ride manipulation\
Secure payment flow

\
**Authentication Module Specification**
=======================================
**Module Name**

Authentication & User Account Management

**Purpose**

Allows users to:

- Register new account 
- Login securely 
- Verify identity using OTP 
- Manage sessions 
- Reset password 

Supports **multi-role system**:

customer\
vendor\
driver\
delivery\_partner\
admin

-----
**Pages Covered**

1 Login Page\
2 Signup Page\
3 OTP Verification Page\
4 Forgot Password Page\
5 Reset Password Page\
6 Session Management

-----
**1 Login Page**

**Page URL**

/login

-----
**UI Components**

Phone Number Input\
OR Email Input\
Password Input\
Login Button\
Login with Google\
Login with OTP Button\
Forgot Password Link\
Signup Redirect

-----
**Example Layout**

\-------------------------\
Login to your account\
\
Phone / Email\
Password\
\
[ Login ]\
[ Login with OTP ]\
[ Google Login ]\
\
Forgot Password?\
Don't have account? Signup\
\-------------------------

-----
**Login Methods**

**1 Password Login**

email + password

-----
**2 OTP Login**

phone\_number → send OTP → verify OTP

-----
**3 Social Login**

Google OAuth

-----
**API**

**Login**

POST /auth/login

Request:

{\
` `email\_or\_phone,\
` `password\
}

Response:

{\
` `user\_id,\
` `token,\
` `role,\
` `status\
}

-----
**2 Signup Page**

**Page URL**

/signup

-----
**UI Components**

Name Input\
Phone Number\
Email\
Password\
Confirm Password\
Signup Button

-----
**Flow**

1 User enters details\
2 Validate input\
3 Send OTP\
4 Verify OTP\
5 Create account

-----
**API**

POST /auth/register

-----
**3 OTP Verification Page**

**Page URL**

/verify-otp

-----
**UI Components**

OTP Input (6 digits)\
Resend OTP Button\
Timer Countdown\
Verify Button

-----
**Behaviour**

OTP valid for 60 seconds\
Resend allowed after timeout\
Max attempts limit

-----
**API**

POST /auth/verify-otp

Request:

{\
` `phone,\
` `otp\
}

-----
**4 Forgot Password Page**

**Page URL**

/forgot-password

-----
**UI**

Enter Email / Phone\
Send Reset Link / OTP

-----
**Flow**

1 Enter email/phone\
2 Send OTP or link\
3 Redirect to reset page

-----
**5 Reset Password Page**

**Page URL**

/reset-password

-----
**UI**

New Password\
Confirm Password\
Submit Button

-----
**API**

POST /auth/reset-password

-----
**6 Session Management**

**Purpose**

Maintain user login state.

-----
**Token System**

Use:

JWT (JSON Web Token)

-----
**Token Structure**

user\_id\
role\
expiry\_time

-----
**Behaviour**

Token stored in local storage / secure storage\
Auto logout after expiry\
Refresh token mechanism

-----
**Logout**

**API**

POST /auth/logout

-----
**Role-Based Redirection**

After login:

customer → home page\
vendor → vendor dashboard\
driver → driver app\
admin → admin dashboard

-----
**Database Table (Users)**

user\_id\
name\
email\
phone\
password\_hash\
role\
status\
created\_at\
last\_login

-----
**Security Requirements**

Password hashing (bcrypt)\
OTP expiry\
Rate limiting (OTP requests)\
Token validation\
Secure storage

-----
**Error Handling**

**Invalid Password**

Incorrect email or password

-----
**Invalid OTP**

Invalid or expired OTP

-----
**User Not Found**

User does not exist

-----
**Edge Cases**

User tries multiple OTP requests → block temporarily\
User enters wrong password multiple times → lock account\
OTP delay → resend option\
Network failure → retry mechanism

-----
**Optional Advanced Features**

Biometric login (mobile)\
Remember me\
Multi-device login tracking\
Account verification badge

# **Cart Page Specification**
## **Page Name**
Cart Page
## **Page URL**
/cart

-----
# **Page Purpose**
The Cart Page displays all items added by the user before checkout.\
Users can modify item quantities, remove items, apply coupons, and proceed to checkout.

The cart must support items from:

Food Orders\
Grocery Orders

Note: Items from **different vendors must be placed in separate carts**.

-----
# **Page Layout Structure**
1 Navigation Bar\
2 Cart Items Section\
3 Price Summary Section\
4 Coupon Section\
5 Delivery Address Preview\
6 Checkout Button

-----
# **1 Navigation Bar**
Components:

Logo\
Back Button\
Location Display\
Cart Icon\
Profile

-----
# **2 Cart Items Section**
Displays items added by the user.
### **Cart Item Card Layout**
Each item should contain:

Item Image\
Item Name\
Vendor Name\
Quantity Selector\
Item Price\
Remove Button\
Special Instructions

Example:

Burger\
Vendor: Bob's Burgers\
₹199\
\
[-] 1 [+]\
\
Remove

-----
# **Quantity Selector**
Users can increase or decrease item quantity.

Example UI:

[-] 2 [+]

Behaviour:

\+ increases quantity\
\- decreases quantity\
0 removes item

-----
# **Item Data Model**
cart\_item\_id\
product\_id\
vendor\_id\
product\_name\
quantity\
price\
total\_price\
image

-----
# **Remove Item**
Button:

Remove

Behaviour:

remove item from cart\
update cart total

-----
# **Special Instructions**
Users can add instructions.

Example:

Extra spicy\
No onions\
Less oil

Data field:

special\_instruction

-----
# **3 Price Summary Section**
Displays pricing breakdown.
### **Fields**
Subtotal\
Delivery Fee\
Taxes\
Discount\
Total Amount

-----
### **Example Price Summary**
Subtotal: ₹400\
Delivery Fee: ₹30\
Taxes: ₹20\
Discount: -₹50\
\
Total: ₹400

-----
# **Pricing Calculation**
Formula:

total = subtotal + delivery\_fee + tax - discount

-----
# **4 Coupon Section**
Users can apply promo codes.
### **UI**
Enter Coupon Code\
Apply Button

Example:

SAVE50

-----
# **Coupon Data Model**
coupon\_code\
discount\_type\
discount\_value\
minimum\_order\
expiry\_date

-----
# **Coupon Validation Rules**
minimum order value\
valid date\
valid service type\
usage limit

-----
# **5 Delivery Address Preview**
Shows selected delivery address.

Example:

Home\
BTM Layout\
Bangalore

Buttons:

Change Address\
Add New Address

-----
# **Address Data Model**
address\_id\
user\_id\
house\_number\
street\
city\
pincode\
latitude\
longitude

-----
# **6 Checkout Button**
Button:

Proceed to Checkout

Behaviour:

validate cart\
validate vendor availability\
redirect to checkout page

-----
# **API Endpoints**
### **Get Cart**
GET /cart

-----
### **Add Item**
POST /cart/add

Request:

{\
` `product\_id,\
` `quantity\
}

-----
### **Update Quantity**
POST /cart/update

-----
### **Remove Item**
DELETE /cart/item/{cart\_item\_id}

-----
### **Apply Coupon**
POST /cart/apply-coupon

-----
# **Database Tables Used**
carts\
cart\_items\
products\
coupons\
addresses\
vendors

-----
# **Cart Validation Rules**
Before checkout:

vendor must be open\
items must be in stock\
delivery location must be serviceable\
minimum order value met

-----
# **Edge Cases**
### **Vendor Closed**
Show message:

Vendor is currently closed

-----
### **Item Out of Stock**
Show:

Item no longer available

-----
### **Price Updated**
Show message:

Item price updated

-----
# **Performance Requirements**
Cart update response time:

< 500 ms

-----
# **Security Considerations**
validate prices server side\
prevent cart manipulation\
secure coupon usage

# **Checkout Page Specification**
## **Page Name**
Checkout Page
## **Page URL**
/checkout

-----
# **Page Purpose**
The Checkout Page allows users to review their order, select a delivery address, choose payment methods, and confirm the order.

After successful confirmation, the order is created in the system and sent to the vendor.

-----
# **Page Layout Structure**
1 Navigation Bar\
2 Delivery Address Section\
3 Order Summary Section\
4 Delivery Instructions\
5 Payment Method Section\
6 Price Breakdown\
7 Place Order Button

-----
# **1 Navigation Bar**
Components:

Back Button\
Logo\
Secure Checkout Indicator

Example:

🔒 Secure Checkout

-----
# **2 Delivery Address Section**
Displays selected address.

Example:

Home\
BTM Layout\
Bangalore\
560076

Buttons:

Change Address\
Add New Address

-----
# **Address Fields**
address\_id\
user\_id\
house\_number\
street\
city\
pincode\
latitude\
longitude\
label

-----
# **Address Validation**
System must check:

serviceable area\
vendor delivery radius

-----
# **3 Order Summary Section**
Displays cart items.
### **Item Fields**
Item Image\
Item Name\
Quantity\
Price\
Vendor Name

Example:

Chicken Burger x2\
₹398\
Vendor: Bob's Burgers

-----
# **4 Delivery Instructions**
User can add delivery notes.

Example:

Leave at door\
Call on arrival\
Ring the bell

Field:

delivery\_instructions

-----
# **5 Payment Method Section**
User selects payment option.
### **Available Payment Methods**
UPI\
Credit Card\
Debit Card\
Wallet\
Cash on Delivery

-----
# **Payment Method UI**
Example:

○ UPI\
○ Credit Card\
○ Debit Card\
○ Wallet\
○ Cash on Delivery

Only one option selectable.

-----
# **Payment Gateway Integration**
Supported gateways:

Razorpay\
Stripe\
PayPal

-----
# **Payment Data Model**
payment\_id\
order\_id\
payment\_method\
transaction\_id\
payment\_status\
amount

-----
# **Payment Status**
pending\
success\
failed\
refunded

-----
# **6 Price Breakdown**
Displays final order price.

Fields:

Subtotal\
Delivery Fee\
Taxes\
Discount\
Platform Fee\
Total Amount

-----
# **Example Price**
Subtotal: ₹400\
Delivery Fee: ₹30\
Taxes: ₹20\
Discount: -₹50\
\
Total: ₹400

-----
# **Price Calculation Formula**
total = subtotal + delivery\_fee + tax + platform\_fee - discount

-----
# **7 Place Order Button**
Button:

Place Order

Behaviour:

1 Validate cart\
2 Validate address\
3 Process payment\
4 Create order\
5 Send order to vendor\
6 Redirect to tracking page

-----
# **Order Creation**
Order object created in database.
### **Order Fields**
order\_id\
user\_id\
vendor\_id\
address\_id\
order\_type\
total\_amount\
payment\_status\
order\_status\
created\_at

-----
# **Order Status Workflow**
Order Placed\
Vendor Accepted\
Preparing\
Picked Up\
Out for Delivery\
Delivered\
Cancelled

-----
# **API Endpoints**
### **Create Order**
POST /orders

Request example:

{\
` `user\_id,\
` `vendor\_id,\
` `items[],\
` `address\_id,\
` `payment\_method,\
` `delivery\_instructions\
}

-----
### **Process Payment**
POST /payments/process

-----
### **Get Order Details**
GET /orders/{order\_id}

-----
# **Database Tables Used**
orders\
order\_items\
payments\
vendors\
addresses\
coupons

-----
# **Edge Cases**
### **Payment Failed**
Show:

Payment failed\
Please try again

-----
### **Vendor Closed**
Show:

Vendor is currently closed

-----
### **Address Out of Range**
Show:

Delivery not available at this location

-----
# **Performance Requirements**
Checkout response time:

< 2 seconds

-----
# **Security Requirements**
validate payment server side\
prevent price tampering\
encrypt payment data\
secure API endpoints
#
# **Order Tracking Page Specification**
## **Page Name**
Order Tracking Page
## **Page URL**
/orders/{order\_id}/tracking

-----
# **Page Purpose**
The Order Tracking Page allows users to track the real-time progress of their order from preparation to delivery.

The page displays order status, delivery partner information, estimated arrival time, and live map tracking.

-----
# **Page Layout Structure**
1 Navigation Bar\
2 Order Status Timeline\
3 Vendor Information\
4 Delivery Partner Information\
5 Live Map Tracking\
6 Order Details\
7 ETA Countdown\
8 Contact Buttons\
9 Cancel Order Option

-----
# **1 Navigation Bar**
Components:

Back Button\
Order ID\
Help / Support Button

Example:

Order #ORD1234

-----
# **2 Order Status Timeline**
Shows order progress visually.
### **Status Steps**
Order Placed\
Vendor Accepted\
Preparing\
Picked Up\
Out for Delivery\
Delivered

-----
### **Timeline UI**
✔ Order Placed\
✔ Vendor Accepted\
✔ Preparing\
→ Picked Up\
○ Out for Delivery\
○ Delivered

Current stage highlighted.

-----
# **Order Status Data Model**
order\_status\
status\_updated\_at\
status\_history

-----
# **3 Vendor Information**
Displays restaurant/store details.

Fields:

Vendor Name\
Vendor Address\
Vendor Phone

Example:

Bob's Burgers\
BTM Layout\
+91 9876543210

-----
# **4 Delivery Partner Information**
Displays delivery agent details.

Fields:

Partner Name\
Partner Rating\
Vehicle Number\
Profile Photo

Example:

Rahul\
⭐ 4.7\
Vehicle: KA01AB1234

-----
# **Contact Options**
Buttons:

Call Driver\
Chat Driver

-----
# **5 Live Map Tracking**
Displays real-time location.

Map should show:

Vendor Location\
Delivery Partner Location\
Customer Location\
Delivery Route

-----
# **Map Integration**
Use:

Google Maps API\
Directions API

-----
# **Real-time Tracking**
Delivery partner sends location updates.

Update frequency:

every 3–5 seconds

-----
# **Tracking Data Model**
tracking\_id\
order\_id\
driver\_id\
latitude\
longitude\
timestamp

-----
# **Map Behaviour**
Driver icon moves on map\
Route line displayed\
ETA updated dynamically

-----
# **6 Order Details Section**
Shows items ordered.

Fields:

Item Name\
Quantity\
Price

Example:

Chicken Burger x2\
₹398

-----
# **Order Details Data Model**
order\_items\
product\_name\
quantity\
price

-----
# **7 ETA Countdown**
Displays estimated delivery time.

Example:

Arriving in 12 minutes

ETA calculated using:

distance\
traffic conditions\
driver speed

-----
# **ETA Calculation**
ETA = distance / average\_speed

Updated dynamically.

-----
# **8 Contact Buttons**
Options:

Call Vendor\
Call Delivery Partner\
Customer Support

-----
# **9 Cancel Order Option**
Available only before pickup.

Condition:

order\_status = preparing

Button:

Cancel Order

-----
# **Cancel Workflow**
1 User clicks cancel\
2 Show confirmation popup\
3 Cancel order\
4 Refund if prepaid

-----
# **Cancel API**
POST /orders/{order\_id}/cancel

-----
# **API Endpoints**
### **Get Order Details**
GET /orders/{order\_id}

-----
### **Get Order Tracking**
GET /orders/{order\_id}/tracking

-----
### **Driver Location Update**
POST /delivery/location

-----
# **Database Tables Used**
orders\
order\_items\
delivery\_partners\
order\_tracking\
vendors\
payments

-----
# **Edge Cases**
### **Driver Delayed**
Show message:

Driver delayed due to traffic

-----
### **Order Cancelled**
Show:

Order Cancelled\
Refund initiated

-----
### **Driver Reassigned**
Show message:

New delivery partner assigned

-----
# **Performance Requirements**
Location update latency:

< 2 seconds

Map loading time:

< 3 seconds

-----
# **Security Requirements**
validate order ownership\
secure location updates\
prevent location spoofing

-----
# **Next Pages in System**
Ab **customer flow almost complete ho gaya**.

Next modules in PRD should be:

Customer Profile Page\
Order History Page\
Saved Addresses Page\
Payment Methods Page\
Customer Support Page

Then after that:

Vendor Dashboard\
Driver App\
Delivery Partner App\
Admin Panels
#
# **Customer Profile Page Specification**
## **Page Name**
Customer Profile Page
## **Page URL**
/profile

-----
# **Page Purpose**
The Customer Profile Page allows users to manage their personal information, saved addresses, payment methods, order history, and account settings.

It acts as the main account dashboard for users.

-----
# **Page Layout Structure**
1 Navigation Bar\
2 Profile Information Section\
3 Profile Menu / Sidebar\
4 Profile Details\
5 Logout Button

-----
# **1 Navigation Bar**
Components:

Back Button\
Profile Title\
Support Button

Example:

My Account

-----
# **2 Profile Information Section**
Displays basic user details.

Fields:

Profile Photo\
User Name\
Phone Number\
Email Address

Example:

Name: Abdu\
Phone: +91 9876543210\
Email: abdu@email.com

-----
# **Profile Data Model**
user\_id\
name\
phone\
email\
profile\_photo\
created\_at

-----
# **3 Profile Menu / Sidebar**
The profile page should contain menu items.

My Orders\
Saved Addresses\
Payment Methods\
Wallet\
Support\
Settings\
Logout

-----
# **4 Profile Details Pages**
Each menu item opens a corresponding page.

-----
# **My Orders Page**
## **Purpose**
Shows all previous orders.

-----
## **Page URL**
/profile/orders

-----
## **Order Card Fields**
Order ID\
Vendor Name\
Items Ordered\
Total Amount\
Order Status\
Order Date

Example:

Order #12345\
Bob's Burgers\
₹398\
Delivered\
June 10

-----
## **Actions**
View Order\
Reorder\
Track Order

-----
# **Saved Addresses Page**
## **Page URL**
/profile/addresses

-----
## **Address Card Fields**
Address Label\
Street\
City\
Pincode

Example:

Home\
BTM Layout\
Bangalore\
560076

-----
## **Address Actions**
Add Address\
Edit Address\
Delete Address\
Set Default

-----
# **Address Data Model**
address\_id\
user\_id\
label\
house\_number\
street\
city\
pincode\
latitude\
longitude

-----
# **Payment Methods Page**
## **Page URL**
/profile/payments

-----
## **Supported Methods**
UPI\
Credit Card\
Debit Card\
Wallet

-----
## **Payment Card Fields**
card\_last4\
card\_type\
expiry\_date

Example:

Visa \*\*\*\* 1234\
Expires 08/27

-----
## **Payment Actions**
Add Payment Method\
Remove Payment Method\
Set Default

-----
# **Wallet Page**
## **Page URL**
/profile/wallet

-----
## **Wallet Fields**
wallet\_balance\
last\_transactions

Example:

Wallet Balance: ₹250

-----
# **Wallet Transaction Fields**
transaction\_id\
amount\
type\
date\
status

Example:

+₹100 Refund

-----
# **Support Page**
## **Page URL**
/profile/support

-----
## **Features**
Create Support Ticket\
View Ticket Status\
Chat Support

-----
# **Support Ticket Fields**
ticket\_id\
issue\_type\
description\
status\
created\_at

-----
# **Settings Page**
## **Page URL**
/profile/settings

-----
## **Settings Options**
Change Password\
Notification Preferences\
Language Settings\
Delete Account

-----
# **Logout Button**
Button:

Logout

-----
# **Logout API**
POST /auth/logout

-----
# **API Endpoints**
### **Get User Profile**
GET /users/profile

-----
### **Update Profile**
PUT /users/profile

-----
### **Get Orders**
GET /users/orders

-----
### **Get Addresses**
GET /users/addresses

-----
# **Database Tables Used**
users\
orders\
order\_items\
addresses\
payments\
wallets\
support\_tickets

-----
# **Security Requirements**
authenticate user token\
encrypt sensitive data\
validate profile updates

-----
# **Edge Cases**
### **No Orders**
Show message:

No orders yet

-----
### **No Address**
Show:

Add your first address

-----
# **Performance Requirements**
Profile page load time:

< 2 seconds

\
**Vendor Dashboard Specification**
==================================
## **Module Name**
Vendor Dashboard
## **Purpose**
The Vendor Dashboard allows vendors (restaurants, grocery stores, service providers) to manage their business on the platform. Vendors can receive orders, manage products or menus, update availability, and track earnings.

-----
# **Vendor Roles**
restaurant\_vendor\
grocery\_vendor\
service\_provider

-----
# **Vendor Dashboard URL**
/vendor/dashboard

-----
# **Dashboard Layout Structure**
1 Sidebar Navigation\
2 Top Navigation Bar\
3 Dashboard Overview\
4 Orders Management\
5 Product/Menu Management\
6 Store Settings\
7 Reviews\
8 Earnings & Reports

-----
# **1 Sidebar Navigation**
Vendor dashboard sidebar should include:

Dashboard\
Orders\
Products / Menu\
Store Settings\
Reviews\
Earnings\
Notifications\
Support\
Logout

-----
# **2 Top Navigation Bar**
Components:

Store Name\
Notifications\
Profile Menu

Example:

Bob's Burgers

-----
# **3 Dashboard Overview**
Shows quick business stats.
### **Stats Cards**
Today's Orders\
Pending Orders\
Total Revenue\
Average Rating

Example:

Orders Today: 12\
Revenue: ₹4,500\
Rating: 4.6

-----
# **4 Orders Management Page**
## **Page URL**
/vendor/orders

-----
## **Order Table Fields**
Order ID\
Customer Name\
Items Ordered\
Total Amount\
Order Status\
Order Time

Example:

Order #1024\
Rahul Sharma\
Burger x2\
₹398\
Preparing\
12:30 PM

-----
# **Order Status Workflow**
New Order\
Accepted\
Preparing\
Ready for Pickup\
Picked Up\
Completed

-----
# **Vendor Actions**
Accept Order\
Reject Order\
Update Status\
View Details

-----
# **Order Notification**
When new order arrives:

play alert sound\
show popup notification

-----
# **5 Product / Menu Management**
Allows vendors to manage products.

-----
## **Page URL**
/vendor/products

-----
# **Product Table Fields**
Product Name\
Category\
Price\
Stock\
Status

Example:

Chicken Burger\
Fast Food\
₹199\
Available

-----
# **Product Actions**
Add Product\
Edit Product\
Delete Product\
Enable / Disable Product

-----
# **Product Data Model**
product\_id\
vendor\_id\
product\_name\
category\
price\
description\
image\
stock\
status

-----
# **6 Store Settings Page**
## **Page URL**
/vendor/store-settings

-----
# **Store Fields**
Store Name\
Store Logo\
Address\
Phone\
Opening Hours\
Delivery Radius

Example:

Bob's Burgers\
BTM Layout\
Open: 10 AM – 11 PM

-----
# **Store Actions**
Update Store Info\
Change Opening Hours\
Toggle Store Availability

-----
# **Store Availability**
Vendor can set:

Open\
Closed\
Busy

-----
# **7 Reviews Page**
## **Page URL**
/vendor/reviews

-----
# **Review Fields**
Customer Name\
Rating\
Review Text\
Date

Example:

⭐ 4.5\
Great food and fast delivery

-----
# **Vendor Actions**
Reply to Review\
Report Review

-----
# **8 Earnings & Reports**
## **Page URL**
/vendor/earnings

-----
# **Earnings Fields**
Daily Revenue\
Weekly Revenue\
Monthly Revenue\
Total Earnings

Example:

Today: ₹2,300\
This Week: ₹14,000

-----
# **Earnings Breakdown**
Order Revenue\
Platform Commission\
Delivery Charges\
Net Earnings

-----
# **Reports**
Vendor can export reports.

Daily Report\
Weekly Report\
Monthly Report

-----
# **API Endpoints**
### **Get Vendor Orders**
GET /vendor/orders

-----
### **Update Order Status**
POST /vendor/orders/{order\_id}/status

-----
### **Get Products**
GET /vendor/products

-----
### **Add Product**
POST /vendor/products

-----
# **Database Tables Used**
vendors\
products\
orders\
order\_items\
reviews\
vendor\_earnings

-----
# **Security Requirements**
verify vendor identity\
restrict access to vendor data\
protect order data

-----
# **Edge Cases**
### **Vendor Rejects Order**
System should:

reassign order\
notify customer

-----
### **Vendor Offline**
System should:

hide vendor from listings

-----
# **Performance Requirements**
Vendor dashboard load time:

< 2 seconds
#
# **Delivery Partner App Specification**
## **Module Name**
Delivery Partner App
## **Purpose**
The Delivery Partner App allows delivery riders to accept delivery requests, navigate to vendor and customer locations, complete deliveries, and track their earnings.

This module supports deliveries for:

Food Orders\
Grocery Orders

-----
# **Delivery Partner Roles**
delivery\_partner\
fleet\_partner (optional for companies)

-----
# **App Main Navigation**
1 Dashboard\
2 Available Orders\
3 Active Delivery\
4 Earnings\
5 Delivery History\
6 Profile\
7 Support

-----
# **1 Dashboard**
## **Page Purpose**
Shows partner status and quick stats.

-----
## **Dashboard Components**
Online / Offline Toggle\
Today's Earnings\
Completed Deliveries\
Pending Deliveries\
Rating

-----
### **Example Dashboard**
Status: Online\
\
Today's Earnings: ₹850\
Deliveries Completed: 6\
Rating: ⭐ 4.7

-----
# **Partner Status Toggle**
Delivery partner can switch availability.

Online\
Offline

When status = **offline**

no delivery requests shown

-----
# **2 Available Orders Page**
## **Page URL**
/partner/orders

-----
## **Purpose**
Displays nearby orders available for pickup.

-----
## **Order Card Fields**
Order ID\
Vendor Name\
Pickup Distance\
Delivery Distance\
Estimated Earnings\
Order Type

Example:

Order #1024\
Bob's Burgers\
Pickup: 1.2 km\
Delivery: 3.4 km\
Earnings: ₹65

-----
# **Order Actions**
Accept Order\
Reject Order

-----
# **Accept Order Flow**
1 Driver clicks Accept\
2 System assigns order\
3 Order moves to Active Delivery

-----
# **Reject Order**
order goes to next nearby driver

-----
# **Order Data Model**
order\_id\
vendor\_id\
customer\_id\
pickup\_location\
delivery\_location\
distance\
earnings\
order\_type

-----
# **3 Active Delivery Page**
## **Page URL**
/partner/active-delivery

-----
## **Page Purpose**
Shows current delivery and navigation.

-----
# **Delivery Steps**
Navigate to Vendor\
Pickup Order\
Navigate to Customer\
Deliver Order\
Complete Delivery

-----
# **Delivery UI Components**
Vendor Information\
Customer Information\
Live Map Navigation\
Call Buttons\
Order Status Buttons

-----
# **Vendor Details**
Vendor Name\
Vendor Address\
Vendor Phone

-----
# **Customer Details**
Customer Name\
Delivery Address\
Customer Phone

-----
# **Navigation Map**
Uses:

Google Maps API\
Navigation SDK

Shows:

pickup location\
delivery location\
route path

-----
# **Delivery Status Buttons**
Arrived at Vendor\
Order Picked Up\
Arrived at Customer\
Delivered

-----
# **Delivery Workflow**
Order Accepted\
Arrived at Vendor\
Picked Up\
Out for Delivery\
Delivered

-----
# **Delivery Confirmation**
Driver confirms delivery.

Example:

Enter OTP

-----
# **Delivery OTP Fields**
delivery\_otp\
order\_id

-----
# **4 Earnings Page**
## **Page URL**
/partner/earnings

-----
# **Earnings Fields**
Today's Earnings\
Weekly Earnings\
Monthly Earnings\
Total Earnings

Example:

Today: ₹850\
Week: ₹4,300\
Month: ₹17,200

-----
# **Earnings Breakdown**
Delivery Fees\
Tips\
Bonuses\
Platform Commission

-----
# **5 Delivery History**
## **Page URL**
/partner/history

-----
# **Delivery Card Fields**
Order ID\
Vendor Name\
Delivery Location\
Earnings\
Date\
Status

Example:

Order #2045\
₹70\
Delivered

-----
# **6 Profile Page**
## **Page URL**
/partner/profile

-----
# **Profile Fields**
Name\
Phone\
Profile Photo\
Vehicle Type\
Vehicle Number

Example:

Vehicle: Bike\
Number: KA01AB1234

-----
# **Profile Data Model**
partner\_id\
name\
phone\
vehicle\_type\
vehicle\_number\
rating

-----
# **7 Support Page**
## **Page URL**
/partner/support

-----
# **Features**
Raise Support Ticket\
Chat Support\
Report Delivery Issue

-----
# **API Endpoints**
### **Get Available Orders**
GET /partner/orders

-----
### **Accept Order**
POST /partner/orders/{order\_id}/accept

-----
### **Update Delivery Status**
POST /partner/orders/{order\_id}/status

-----
### **Get Earnings**
GET /partner/earnings

-----
# **Database Tables Used**
delivery\_partners\
orders\
order\_tracking\
earnings\
delivery\_history\
support\_tickets

-----
# **Real-Time Location Updates**
Driver sends GPS updates.

Frequency:

every 3 seconds

Fields:

partner\_id\
latitude\
longitude\
timestamp

-----
# **Edge Cases**
### **Driver Cancels Delivery**
order reassigned to another driver

-----
### **Customer Not Available**
Driver options:

Call customer\
Wait timer\
Mark unreachable

-----
# **Security Requirements**
validate driver identity\
prevent fake GPS updates\
secure order confirmation

-----
# **Performance Requirements**
Driver assignment time:

< 5 seconds

Map update latency:

< 2 seconds

# **Driver App Specification**
## **Module Name**
Driver App (Ride Services)
## **Purpose**
The Driver App allows drivers to accept ride requests, navigate to passenger pickup locations, complete trips, and track their earnings.

This module supports ride types:

Bike Taxi\
Auto Taxi

-----
# **Driver Roles**
bike\_driver\
auto\_driver\
fleet\_driver

-----
# **App Navigation Structure**
1 Dashboard\
2 Ride Requests\
3 Active Trip\
4 Earnings\
5 Trip History\
6 Profile\
7 Support

-----
# **1 Dashboard**
## **Purpose**
Displays driver availability and daily stats.

-----
# **Dashboard Components**
Online / Offline Toggle\
Today's Earnings\
Trips Completed\
Driver Rating

-----
# **Example Dashboard**
Status: Online\
\
Today's Earnings: ₹1,250\
Trips Completed: 8\
Rating: ⭐ 4.8

-----
# **Driver Availability Toggle**
Driver can switch status:

Online\
Offline

If driver is **offline**:

no ride requests shown

-----
# **2 Ride Requests Page**
## **Page URL**
/driver/ride-requests

-----
# **Purpose**
Shows nearby ride requests.

-----
# **Ride Request Card Fields**
Ride ID\
Pickup Location\
Drop Location\
Distance\
Estimated Fare\
Passenger Rating

Example:

Ride #4521\
Pickup: Indiranagar\
Drop: BTM Layout\
Distance: 6 km\
Fare: ₹110\
Passenger Rating: ⭐4.5

-----
# **Ride Request Actions**
Accept Ride\
Reject Ride

-----
# **Accept Ride Flow**
1 Driver clicks Accept\
2 System assigns ride\
3 Ride moves to Active Trip

-----
# **Reject Ride**
ride sent to next nearby driver

-----
# **Ride Request Data Model**
ride\_id\
passenger\_id\
pickup\_location\
drop\_location\
distance\
fare\_estimate\
vehicle\_type

-----
# **3 Active Trip Page**
## **Page URL**
/driver/active-trip

-----
# **Purpose**
Displays current ride and navigation.

-----
# **Trip Steps**
Navigate to Pickup\
Arrive at Pickup\
Start Trip\
Navigate to Destination\
End Trip

-----
# **Active Trip UI Components**
Passenger Information\
Pickup Location\
Destination\
Navigation Map\
Trip Status Buttons\
Call Passenger

-----
# **Passenger Details**
Passenger Name\
Passenger Rating\
Passenger Phone

Example:

Rahul Sharma\
⭐4.6\
+91 9876543210

-----
# **Map Navigation**
Uses:

Google Maps API\
Navigation SDK\
Directions API

Map shows:

driver location\
pickup location\
destination\
route path

-----
# **Trip Status Buttons**
Arrived at Pickup\
Start Trip\
End Trip

-----
# **Trip Workflow**
Ride Accepted\
Driver Arrived\
Trip Started\
Trip Completed

-----
# **Fare Calculation**
Formula:

fare = base\_fare + (distance × price\_per\_km) + (time × price\_per\_min)

-----
# **Fare Data Model**
base\_fare\
distance\
price\_per\_km\
price\_per\_min\
surge\_multiplier\
total\_fare

-----
# **Payment Completion**
After trip ends:

calculate final fare\
process payment\
generate trip receipt

-----
# **4 Earnings Page**
## **Page URL**
/driver/earnings

-----
# **Earnings Fields**
Today's Earnings\
Weekly Earnings\
Monthly Earnings\
Total Earnings

Example:

Today: ₹1,250\
Week: ₹6,200\
Month: ₹24,500

-----
# **Earnings Breakdown**
Ride Fare\
Tips\
Bonuses\
Platform Commission

-----
# **5 Trip History**
## **Page URL**
/driver/history

-----
# **Trip Card Fields**
Ride ID\
Pickup Location\
Destination\
Fare\
Date\
Status

Example:

Ride #3214\
₹110\
Completed

-----
# **6 Profile Page**
## **Page URL**
/driver/profile

-----
# **Profile Fields**
Name\
Phone\
Profile Photo\
Vehicle Type\
Vehicle Number\
Driving License\
Rating

Example:

Vehicle: Auto\
Number: KA03AB4567\
License: DL123456789

-----
# **Driver Data Model**
driver\_id\
name\
phone\
vehicle\_type\
vehicle\_number\
license\_number\
rating\
status

-----
# **7 Support Page**
## **Page URL**
/driver/support

-----
# **Support Features**
Create Support Ticket\
Trip Issue Report\
Chat Support

-----
# **API Endpoints**
### **Get Ride Requests**
GET /driver/rides

-----
### **Accept Ride**
POST /driver/rides/{ride\_id}/accept

-----
### **Update Trip Status**
POST /driver/rides/{ride\_id}/status

-----
### **Get Earnings**
GET /driver/earnings

-----
# **Database Tables Used**
drivers\
rides\
ride\_tracking\
ride\_history\
earnings\
support\_tickets

-----
# **Real-Time Location Updates**
Driver sends location updates.

Frequency:

every 3 seconds

Fields:

driver\_id\
latitude\
longitude\
timestamp

-----
# **Edge Cases**
### **Passenger Cancels Ride**
notify driver\
apply cancellation fee

-----
### **Driver Cancels Ride**
assign ride to next driver

-----
# **Security Requirements**
verify driver identity\
prevent GPS spoofing\
secure ride data

-----
# **Performance Requirements**
Ride assignment time:

< 5 seconds

Map update latency:

< 2 seconds

\
**Operational Admin Dashboard Specification**
=============================================
## **Module Name**
Operational Admin Dashboard
## **Purpose**
The Operational Admin Dashboard is used by the operations team to monitor and manage all platform activities including orders, rides, vendors, delivery partners, drivers, and service bookings.

The operations team ensures smooth functioning of the platform and resolves operational issues.

-----
# **Dashboard URL**
/admin/operations

-----
# **Dashboard Layout Structure**
1 Sidebar Navigation\
2 Top Navigation Bar\
3 Dashboard Overview\
4 Order Management\
5 Ride Management\
6 Vendor Management\
7 Service Booking Management\
8 Delivery Partner Management\
9 Driver Management

-----
# **1 Sidebar Navigation**
Admin sidebar menu should contain:

Dashboard\
Orders\
Rides\
Vendors\
Services\
Delivery Partners\
Drivers\
Reports\
Support Tickets\
Logout

-----
# **2 Top Navigation Bar**
Components:

Admin Name\
Notifications\
Search Bar\
Profile Menu

Example:

Operations Admin

-----
# **3 Dashboard Overview**
Displays overall platform metrics.

-----
# **Stats Cards**
Total Orders Today\
Active Deliveries\
Active Rides\
Total Vendors\
Total Drivers\
Total Delivery Partners

Example:

Orders Today: 320\
Active Deliveries: 45\
Active Rides: 28

-----
# **Graphs**
Admin dashboard should show charts.

Orders per hour\
Ride requests per hour\
Revenue graph

-----
# **4 Order Management Page**
## **Page URL**
/admin/orders

-----
# **Filters**
Search Order ID\
Status Filter\
Vendor Filter\
Payment Method\
Date Filter

-----
# **Order Table Fields**
Order ID\
Customer Name\
Vendor Name\
Order Type\
Items\
Amount\
Payment Status\
Order Status\
Delivery Partner\
Order Time

Example:

Order #1024\
Rahul Sharma\
Bob's Burgers\
Food\
₹398\
Paid\
Preparing

-----
# **Order Actions**
View Order\
Assign Delivery Partner\
Update Order Status\
Cancel Order\
Refund Order

-----
# **Order Details Modal**
When admin clicks **View Order**, show:

Customer Details\
Vendor Details\
Order Items\
Payment Details\
Delivery Details

-----
# **5 Ride Management Page**
## **Page URL**
/admin/rides

-----
# **Ride Table Fields**
Ride ID\
Passenger\
Driver\
Vehicle Type\
Pickup Location\
Drop Location\
Fare\
Ride Status\
Ride Time

Example:

Ride #2314\
Rahul Sharma\
Driver: Amit\
Bike\
₹120\
Completed

-----
# **Ride Actions**
Assign Driver\
Cancel Ride\
View Route\
Refund Ride

-----
# **6 Vendor Management Page**
## **Page URL**
/admin/vendors

-----
# **Vendor Table Fields**
Vendor ID\
Vendor Name\
Vendor Type\
Rating\
Total Orders\
Status

Example:

Vendor #321\
Bob's Burgers\
Restaurant\
⭐4.5\
Active

-----
# **Vendor Actions**
Approve Vendor\
Suspend Vendor\
Edit Vendor\
View Products

-----
# **7 Service Booking Management**
## **Page URL**
/admin/services

-----
# **Booking Table Fields**
Booking ID\
Customer\
Service Type\
Assigned Worker\
Price\
Booking Time\
Status

Example:

Booking #4001\
AC Repair\
Worker: Ramesh\
₹499\
Completed

-----
# **Service Actions**
Assign Worker\
Update Status\
Cancel Booking\
View Details

-----
# **8 Delivery Partner Management**
## **Page URL**
/admin/delivery-partners

-----
# **Delivery Partner Fields**
Partner ID\
Name\
Vehicle Type\
Total Deliveries\
Rating\
Status

Example:

Partner #21\
Rahul\
Bike\
450 deliveries\
⭐4.6\
Online

-----
# **Partner Actions**
Approve Partner\
Suspend Partner\
View Delivery History\
Track Location

-----
# **9 Driver Management**
## **Page URL**
/admin/drivers

-----
# **Driver Table Fields**
Driver ID\
Name\
Vehicle Type\
Vehicle Number\
Trips Completed\
Rating\
Status

Example:

Driver #14\
Amit Kumar\
Auto\
KA01AB1234\
320 trips\
⭐4.7\
Online

-----
# **Driver Actions**
Approve Driver\
Suspend Driver\
View Trips\
Track Location

-----
# **API Endpoints**
### **Get Orders**
GET /admin/orders

-----
### **Update Order Status**
POST /admin/orders/{order\_id}/status

-----
### **Get Rides**
GET /admin/rides

-----
### **Get Vendors**
GET /admin/vendors

-----
# **Database Tables Used**
orders\
rides\
vendors\
drivers\
delivery\_partners\
service\_bookings\
payments

-----
# **Security Requirements**
role-based access control\
admin authentication\
audit logs for actions

-----
# **Performance Requirements**
Dashboard load time:

< 2 seconds

Admin search response:

< 500 ms

\
**Super Admin Dashboard Specification**
=======================================
## **Module Name**
Super Admin Dashboard
## **Purpose**
The Super Admin Dashboard provides full control over the platform including system configuration, admin management, pricing rules, commissions, and platform-wide analytics.

Super Admin users can create operational admins, manage permissions, and configure system-wide settings.

-----
# **Super Admin Roles**
super\_admin\
system\_admin\
platform\_owner

-----
# **Dashboard URL**
/admin/super

-----
# **Dashboard Layout Structure**
1 Sidebar Navigation\
2 Top Navigation Bar\
3 Platform Overview\
4 Admin Management\
5 Commission Settings\
6 Service Configuration\
7 System Settings\
8 Analytics & Reports\
9 Platform Logs

-----
# **1 Sidebar Navigation**
Dashboard\
Admins\
Commission Settings\
Service Configuration\
Platform Settings\
Analytics\
Audit Logs\
System Health\
Logout

-----
# **2 Top Navigation Bar**
Components:

Admin Name\
Notifications\
Search\
Profile Menu

Example:

Super Admin

-----
# **3 Platform Overview**
Displays system-wide metrics.

-----
# **Stats Cards**
Total Users\
Total Vendors\
Total Orders\
Total Rides\
Total Revenue\
Active Drivers\
Active Delivery Partners

Example:

Users: 45,000\
Orders Today: 1,200\
Revenue Today: ₹3,40,000

-----
# **Graphs**
Daily Orders Graph\
Ride Requests Graph\
Revenue Graph\
User Growth Graph

-----
# **4 Admin Management**
## **Page URL**
/admin/super/admins

-----
# **Admin Table Fields**
Admin ID\
Admin Name\
Email\
Role\
Status\
Created Date

Example:

Admin #12\
Rahul\
Operations Admin\
Active

-----
# **Admin Roles**
Super Admin\
Operations Admin\
Customer Care Admin\
Verification Admin\
Finance Admin

-----
# **Admin Actions**
Create Admin\
Edit Admin\
Disable Admin\
Delete Admin

-----
# **Admin Data Model**
admin\_id\
name\
email\
role\
status\
created\_at

-----
# **5 Commission Settings**
## **Page URL**
/admin/super/commission

-----
# **Commission Fields**
Food Order Commission\
Grocery Order Commission\
Ride Commission\
Service Commission

Example:

Food Commission: 20%\
Ride Commission: 15%

-----
# **Commission Actions**
Update Commission\
Set Commission by Vendor\
Set Commission by City

-----
# **Commission Data Model**
commission\_id\
service\_type\
percentage\
created\_at

-----
# **6 Service Configuration**
## **Page URL**
/admin/super/services

-----
# **Service Types**
Food Delivery\
Grocery Delivery\
Home Services\
Bike Taxi\
Auto Taxi

-----
# **Service Settings**
Enable / Disable Service\
Set Minimum Order Value\
Set Delivery Fee\
Set Surge Pricing

-----
# **Example**
Food Delivery\
Minimum Order: ₹100\
Delivery Fee: ₹30

-----
# **7 Platform Settings**
## **Page URL**
/admin/super/settings

-----
# **Platform Configuration**
App Name\
Support Email\
Support Phone\
Maintenance Mode\
Default Currency\
Timezone

Example:

Currency: INR\
Timezone: IST

-----
# **Maintenance Mode**
Allows admin to temporarily disable the platform.

ON\
OFF

-----
# **8 Analytics & Reports**
## **Page URL**
/admin/super/analytics

-----
# **Reports**
Revenue Report\
Orders Report\
Ride Report\
Vendor Performance\
Driver Performance

-----
# **Filters**
Daily\
Weekly\
Monthly\
Custom Date Range

-----
# **Example Metrics**
Revenue Today: ₹3,40,000\
Orders Today: 1,200\
Average Order Value: ₹280

-----
# **9 Audit Logs**
## **Page URL**
/admin/super/logs

-----
# **Log Fields**
Admin Name\
Action\
Affected Module\
Timestamp\
IP Address

Example:

Admin Rahul\
Updated Commission\
June 18 2026

-----
# **System Health**
Displays infrastructure status.

-----
# **Health Metrics**
API Status\
Database Status\
Payment Gateway Status\
Map Services Status

Example:

API: Online\
Database: Healthy\
Payments: Operational

-----
# **API Endpoints**
### **Get Admins**
GET /admin/super/admins

-----
### **Create Admin**
POST /admin/super/admins

-----
### **Update Commission**
POST /admin/super/commission

-----
### **Get Analytics**
GET /admin/super/analytics

-----
# **Database Tables Used**
admins\
users\
vendors\
orders\
rides\
payments\
commissions\
audit\_logs\
system\_settings

-----
# **Security Requirements**
multi-factor authentication\
role-based permissions\
audit logging\
restricted API access

-----
# **Performance Requirements**
Dashboard load time:

< 2 seconds

Analytics query time:

< 3 seconds
#
# **Customer Care Dashboard Specification**
## **Module Name**
Customer Care Dashboard
## **Purpose**
The Customer Care Dashboard allows support agents to manage customer complaints, resolve order issues, handle ride disputes, process refunds, and respond to support tickets.

It provides visibility into user issues and enables quick resolution.

-----
# **Dashboard URL**
/admin/support

-----
# **Dashboard Layout Structure**
1 Sidebar Navigation\
2 Top Navigation Bar\
3 Support Dashboard Overview\
4 Ticket Management\
5 Order Issues\
6 Ride Issues\
7 Refund Management\
8 Customer Chat\
9 Escalation System

-----
# **1 Sidebar Navigation**
Dashboard\
Support Tickets\
Order Issues\
Ride Issues\
Refund Requests\
Customer Chat\
Escalations\
Reports\
Logout

-----
# **2 Top Navigation Bar**
Components:

Support Agent Name\
Notifications\
Search\
Profile Menu

Example:

Customer Care Agent

-----
# **3 Dashboard Overview**
Displays support metrics.

-----
# **Stats Cards**
Open Tickets\
Tickets Resolved Today\
Pending Refunds\
Active Chats

Example:

Open Tickets: 45\
Resolved Today: 120\
Pending Refunds: 8

-----
# **Ticket Priority Breakdown**
High Priority\
Medium Priority\
Low Priority

Example:

High: 12\
Medium: 20\
Low: 13

-----
# **4 Ticket Management**
## **Page URL**
/admin/support/tickets

-----
# **Ticket Table Fields**
Ticket ID\
Customer Name\
Issue Type\
Order / Ride ID\
Priority\
Status\
Created Time

Example:

Ticket #1201\
Rahul Sharma\
Order Issue\
Order #1024\
High\
Open

-----
# **Issue Types**
Order Delay\
Wrong Item\
Payment Issue\
Ride Complaint\
Driver Behavior\
Refund Request

-----
# **Ticket Actions**
View Ticket\
Reply to Customer\
Change Status\
Escalate\
Close Ticket

-----
# **Ticket Status**
Open\
In Progress\
Resolved\
Closed

-----
# **Ticket Details Page**
When support agent opens ticket:

Fields:

Customer Information\
Order / Ride Details\
Issue Description\
Chat History\
Attachments

-----
# **5 Order Issues Page**
## **Page URL**
/admin/support/order-issues

-----
# **Order Issue Fields**
Order ID\
Customer Name\
Vendor Name\
Issue Type\
Order Status\
Reported Time

Example:

Order #1024\
Rahul Sharma\
Bob's Burgers\
Order Delay\
Preparing

-----
# **Order Issue Actions**
Contact Vendor\
Contact Delivery Partner\
Cancel Order\
Issue Refund\
Escalate

-----
# **6 Ride Issues Page**
## **Page URL**
/admin/support/ride-issues

-----
# **Ride Issue Fields**
Ride ID\
Passenger\
Driver\
Issue Type\
Ride Status\
Reported Time

Example:

Ride #2104\
Passenger: Rahul\
Driver: Amit\
Driver Late

-----
# **Ride Issue Actions**
Contact Driver\
Cancel Ride\
Issue Refund\
Escalate

-----
# **7 Refund Management**
## **Page URL**
/admin/support/refunds

-----
# **Refund Table Fields**
Refund ID\
Customer\
Order / Ride ID\
Refund Amount\
Refund Status\
Request Time

Example:

Refund #5002\
₹398\
Order #1024\
Pending

-----
# **Refund Status**
Pending\
Approved\
Rejected\
Processed

-----
# **Refund Actions**
Approve Refund\
Reject Refund\
Process Refund

-----
# **Refund Data Model**
refund\_id\
order\_id\
user\_id\
amount\
reason\
status\
created\_at

-----
# **8 Customer Chat**
## **Page URL**
/admin/support/chat

-----
# **Chat Fields**
Customer Name\
Chat Messages\
Order / Ride Reference\
Timestamp

Example:

Customer: Rahul\
Issue: Order delay

-----
# **Chat Actions**
Reply to Customer\
Attach Image\
Close Chat\
Escalate Issue

-----
# **9 Escalation System**
Allows unresolved issues to be escalated.

-----
# **Escalation Levels**
Level 1 Support\
Level 2 Support\
Operations Team\
Super Admin

-----
# **Escalation Fields**
Ticket ID\
Escalation Level\
Assigned Team\
Escalation Time

-----
# **API Endpoints**
### **Get Support Tickets**
GET /admin/support/tickets

-----
### **Update Ticket Status**
POST /admin/support/tickets/{ticket\_id}/status

-----
### **Approve Refund**
POST /admin/support/refunds/{refund\_id}/approve

-----
# **Database Tables Used**
support\_tickets\
refunds\
orders\
rides\
users\
vendors\
drivers\
delivery\_partners

-----
# **Security Requirements**
role-based access\
ticket access control\
audit logging

-----
# **Performance Requirements**
Ticket loading time:

< 2 seconds

Chat message delay:

< 1 second

# **Verification / KYC Dashboard Specification**
## **Module Name**
Verification / KYC Dashboard
## **Purpose**
The Verification Dashboard allows the onboarding team to verify documents submitted by vendors, drivers, delivery partners, and service workers before activating their accounts.

This ensures that only verified partners can operate on the platform.

-----
# **Dashboard URL**
/admin/verification

-----
# **Dashboard Layout Structure**
1 Sidebar Navigation\
2 Top Navigation Bar\
3 Verification Overview\
4 Vendor Verification\
5 Driver Verification\
6 Delivery Partner Verification\
7 Service Worker Verification\
8 Document Review\
9 Verification History

-----
# **1 Sidebar Navigation**
Dashboard\
Vendor Verification\
Driver Verification\
Delivery Partner Verification\
Service Worker Verification\
Documents\
Verification History\
Reports\
Logout

-----
# **2 Top Navigation Bar**
Components:

Verification Admin Name\
Notifications\
Search\
Profile Menu

Example:

Verification Admin

-----
# **3 Verification Overview**
Displays pending verification requests.

-----
# **Stats Cards**
Pending Vendor Applications\
Pending Driver Applications\
Pending Delivery Partner Applications\
Pending Service Worker Applications

Example:

Vendors Pending: 15\
Drivers Pending: 22\
Delivery Partners Pending: 8

-----
# **4 Vendor Verification**
## **Page URL**
/admin/verification/vendors

-----
# **Vendor Application Fields**
Vendor ID\
Vendor Name\
Business Name\
Phone Number\
City\
Submitted Date\
Verification Status

Example:

Vendor #321\
Bob's Burgers\
Bangalore\
Pending

-----
# **Vendor Documents Required**
Business License\
FSSAI License (for restaurants)\
GST Registration\
Owner ID Proof\
Bank Account Details

-----
# **Vendor Actions**
Approve Vendor\
Reject Vendor\
Request Additional Documents

-----
# **5 Driver Verification**
## **Page URL**
/admin/verification/drivers

-----
# **Driver Fields**
Driver ID\
Driver Name\
Phone\
Vehicle Type\
Vehicle Number\
City\
Verification Status

Example:

Driver #102\
Amit Kumar\
Auto\
Pending

-----
# **Driver Documents Required**
Driving License\
Vehicle Registration (RC)\
Vehicle Insurance\
Profile Photo\
Identity Proof

-----
# **Driver Actions**
Approve Driver\
Reject Driver\
Request Reupload

-----
# **6 Delivery Partner Verification**
## **Page URL**
/admin/verification/delivery-partners

-----
# **Delivery Partner Fields**
Partner ID\
Name\
Phone\
Vehicle Type\
City\
Verification Status

Example:

Partner #77\
Rahul\
Bike\
Pending

-----
# **Required Documents**
Identity Proof\
Address Proof\
Vehicle Registration\
Profile Photo

-----
# **Actions**
Approve Partner\
Reject Partner\
Request Additional Documents

-----
# **7 Service Worker Verification**
## **Page URL**
/admin/verification/workers

-----
# **Worker Fields**
Worker ID\
Name\
Service Type\
Experience\
City\
Verification Status

Example:

Worker #301\
Ramesh\
Plumber\
5 years\
Pending

-----
# **Required Documents**
Identity Proof\
Experience Certificate\
Training Certification\
Profile Photo

-----
# **Worker Actions**
Approve Worker\
Reject Worker\
Request Additional Documents

-----
# **8 Document Review Page**
Displays uploaded documents.

-----
# **Document Fields**
Document Type\
Uploaded File\
Submission Date\
Verification Status

Example:

Driving License\
Uploaded\
Pending Review

-----
# **Document Actions**
View Document\
Approve\
Reject\
Download

-----
# **9 Verification History**
Tracks past verification actions.

-----
# **History Fields**
Application ID\
Applicant Name\
Verification Result\
Verified By\
Verification Date

Example:

Driver #102\
Approved\
Admin: Rahul\
June 18 2026

-----
# **Verification Status**
Pending\
Approved\
Rejected\
Under Review

-----
# **API Endpoints**
### **Get Vendor Applications**
GET /admin/verification/vendors

-----
### **Approve Vendor**
POST /admin/verification/vendors/{vendor\_id}/approve

-----
### **Get Driver Applications**
GET /admin/verification/drivers

-----
### **Approve Driver**
POST /admin/verification/drivers/{driver\_id}/approve

-----
# **Database Tables Used**
vendors\
drivers\
delivery\_partners\
service\_workers\
documents\
verification\_logs

-----
# **Security Requirements**
secure document storage\
access control\
document encryption\
audit logs

-----
# **Performance Requirements**
Document loading time:

< 2 seconds

Verification processing time:

< 5 seconds
#
# **Finance / Payout Dashboard Specification**
## **Module Name**
Finance / Payout Dashboard
## **Purpose**
The Finance Dashboard allows the finance team to manage platform revenues, process payouts for vendors and partners, monitor transactions, and track refunds.

It ensures accurate financial reporting and payment settlements.

-----
# **Dashboard URL**
/admin/finance

-----
# **Dashboard Layout Structure**
1 Sidebar Navigation\
2 Top Navigation Bar\
3 Financial Overview\
4 Vendor Payouts\
5 Driver Payouts\
6 Delivery Partner Payouts\
7 Refund Management\
8 Revenue Reports\
9 Transaction Logs

-----
# **1 Sidebar Navigation**
Dashboard\
Vendor Payouts\
Driver Payouts\
Delivery Partner Payouts\
Refunds\
Revenue Reports\
Transactions\
Export Reports\
Logout

-----
# **2 Top Navigation Bar**
Components:

Finance Admin Name\
Notifications\
Search\
Profile Menu

Example:

Finance Admin

-----
# **3 Financial Overview**
Displays platform financial statistics.

-----
# **Stats Cards**
Total Revenue Today\
Pending Payouts\
Completed Payouts\
Refunds Today\
Platform Commission

Example:

Revenue Today: ₹3,40,000\
Pending Payouts: ₹85,000\
Refunds Today: ₹5,200

-----
# **Graphs**
Daily Revenue Graph\
Weekly Revenue Graph\
Refund Trends\
Payout Volume

-----
# **4 Vendor Payouts**
## **Page URL**
/admin/finance/vendor-payouts

-----
# **Vendor Payout Fields**
Vendor ID\
Vendor Name\
Total Orders\
Total Revenue\
Platform Commission\
Net Payout\
Payout Status

Example:

Vendor #321\
Bob's Burgers\
Orders: 120\
Revenue: ₹45,000\
Commission: ₹9,000\
Net Payout: ₹36,000\
Pending

-----
# **Vendor Payout Actions**
Approve Payout\
Process Bank Transfer\
View Transaction\
Export Report

-----
# **Vendor Payout Data Model**
payout\_id\
vendor\_id\
total\_orders\
gross\_amount\
commission\
net\_amount\
payout\_status\
created\_at

-----
# **5 Driver Payouts**
## **Page URL**
/admin/finance/driver-payouts

-----
# **Driver Payout Fields**
Driver ID\
Driver Name\
Trips Completed\
Total Earnings\
Platform Commission\
Net Payout\
Payout Status

Example:

Driver #45\
Amit Kumar\
Trips: 210\
Earnings: ₹32,000\
Commission: ₹4,800\
Net Payout: ₹27,200

-----
# **Driver Payout Actions**
Approve Payout\
Process Transfer\
View Earnings

-----
# **6 Delivery Partner Payouts**
## **Page URL**
/admin/finance/delivery-payouts

-----
# **Delivery Partner Fields**
Partner ID\
Partner Name\
Deliveries Completed\
Total Earnings\
Bonuses\
Net Payout\
Status

Example:

Partner #77\
Rahul\
Deliveries: 150\
Earnings: ₹18,000\
Bonus: ₹2,000\
Net: ₹20,000

-----
# **Delivery Partner Actions**
Approve Payout\
Process Payment\
View History

-----
# **7 Refund Management**
## **Page URL**
/admin/finance/refunds

-----
# **Refund Fields**
Refund ID\
Customer Name\
Order / Ride ID\
Refund Amount\
Reason\
Refund Status

Example:

Refund #5011\
Order #1024\
₹398\
Wrong item delivered\
Pending

-----
# **Refund Actions**
Approve Refund\
Reject Refund\
Process Refund

-----
# **Refund Data Model**
refund\_id\
user\_id\
order\_id\
amount\
reason\
status\
created\_at

-----
# **8 Revenue Reports**
## **Page URL**
/admin/finance/reports

-----
# **Report Types**
Daily Revenue\
Weekly Revenue\
Monthly Revenue\
Vendor Revenue\
Ride Revenue\
Service Revenue

-----
# **Filters**
Date Range\
City\
Service Type\
Vendor

-----
# **Example Metrics**
Food Revenue: ₹2,00,000\
Ride Revenue: ₹80,000\
Service Revenue: ₹60,000

-----
# **9 Transaction Logs**
## **Page URL**
/admin/finance/transactions

-----
# **Transaction Fields**
Transaction ID\
User ID\
Transaction Type\
Amount\
Payment Method\
Status\
Timestamp

Example:

TXN9821\
Order Payment\
₹398\
UPI\
Success

-----
# **Transaction Types**
Order Payment\
Ride Payment\
Service Payment\
Refund\
Vendor Payout\
Driver Payout

-----
# **API Endpoints**
### **Get Vendor Payouts**
GET /admin/finance/vendor-payouts

-----
### **Process Vendor Payout**
POST /admin/finance/vendor-payouts/{payout\_id}/process

-----
### **Get Refunds**
GET /admin/finance/refunds

-----
### **Get Revenue Reports**
GET /admin/finance/reports

-----
# **Database Tables Used**
payments\
payouts\
refunds\
transactions\
orders\
rides\
vendors\
drivers\
delivery\_partners

-----
# **Security Requirements**
financial data encryption\
role-based access\
audit logging\
secure payout approvals

-----
# **Performance Requirements**
Report generation time:

< 3 seconds

Transaction search time:

< 500 ms
#
# **Notification System Specification**
## **Module Name**
Notification System
## **Purpose**
The Notification System is responsible for sending alerts and updates to users and platform partners when important events occur such as order updates, ride requests, payments, or support responses.

Notifications ensure real-time communication between the platform and its users.

-----
# **Notification Types**
Push Notification\
SMS Notification\
Email Notification\
In-App Notification

-----
# **Notification Triggers**
Notifications should be triggered for the following events.

Order Placed\
Order Accepted\
Order Picked Up\
Order Delivered\
Ride Requested\
Ride Accepted\
Ride Started\
Ride Completed\
Payment Success\
Payment Failed\
Refund Processed\
OTP Verification\
Support Ticket Reply

-----
# **Notification Recipients**
Customer\
Vendor\
Driver\
Delivery Partner\
Admin

-----
# **Notification Channels**
## **1 Push Notifications**
Used for mobile apps.

Services:

Firebase Cloud Messaging (FCM)\
Apple Push Notification Service (APNS)

Example notification:

Title: Order Accepted\
Message: Your order has been accepted by the restaurant.

-----
# **Push Notification Fields**
notification\_id\
user\_id\
title\
message\
type\
status\
created\_at

-----
# **2 SMS Notifications**
Used for critical alerts.

Examples:

OTP verification\
Order confirmation\
Ride confirmation

SMS provider options:

Twilio\
MSG91\
TextLocal

-----
# **SMS Data Model**
sms\_id\
phone\_number\
message\
status\
sent\_at

-----
# **3 Email Notifications**
Used for detailed communication.

Examples:

Order receipts\
Payment invoices\
Account verification

Email providers:

SendGrid\
Amazon SES\
Mailgun

-----
# **Email Data Model**
email\_id\
recipient\_email\
subject\
body\
status\
sent\_at

-----
# **4 In-App Notifications**
Displayed inside the application.

Example:

Your driver is arriving in 3 minutes

-----
# **In-App Notification Fields**
notification\_id\
user\_id\
title\
message\
is\_read\
created\_at

-----
# **Notification Center UI**
Users should see notifications inside the app.

Fields:

Notification Title\
Notification Message\
Timestamp\
Read / Unread Status

Example:

Order Delivered\
Your order has been successfully delivered.

-----
# **Notification Status**
Pending\
Sent\
Delivered\
Failed

-----
# **Notification Workflow**
Example order notification flow.

1 Customer places order\
2 Vendor receives notification\
3 Delivery partner receives pickup notification\
4 Customer receives order updates

-----
# **Notification Queue System**
Notifications should be processed using a queue.

Recommended tools:

Redis Queue\
RabbitMQ\
Kafka

Benefits:

handles high traffic\
prevents server overload\
ensures reliable delivery

-----
# **Notification Scheduling**
System should support scheduled notifications.

Example:

Promotional offers\
Scheduled reminders\
Subscription renewals

-----
# **API Endpoints**
### **Send Notification**
POST /notifications/send

Request example:

{\
` `user\_id,\
` `title,\
` `message,\
` `type\
}

-----
### **Get User Notifications**
GET /notifications/{user\_id}

-----
### **Mark Notification as Read**
POST /notifications/{notification\_id}/read

-----
# **Database Tables Used**
notifications\
sms\_logs\
email\_logs\
push\_tokens\
users

-----
# **Push Token Storage**
For mobile devices.

user\_id\
device\_type\
device\_token

-----
# **Security Requirements**
validate recipient identity\
protect message data\
prevent notification spam

-----
# **Performance Requirements**
Notification delivery time:

< 1 second for push\
< 5 seconds for SMS

Queue processing latency:

< 500 ms
#
# **Marketing / Promotions System Specification**
## **Module Name**
Marketing & Promotions System
## **Purpose**
The Marketing System allows administrators to create and manage promotional campaigns, discount coupons, referral programs, and advertisements to attract new customers and increase platform engagement.

It also helps vendors promote their products or services through featured placements.

-----
# **System URL**
/admin/marketing

-----
# **System Layout Structure**
1 Sidebar Navigation\
2 Campaign Dashboard\
3 Coupon Management\
4 Referral Program\
5 Advertisement Management\
6 Featured Listings\
7 Campaign Analytics

-----
# **1 Sidebar Navigation**
Dashboard\
Campaigns\
Coupons\
Referral Program\
Advertisements\
Featured Listings\
Analytics\
Logout

-----
# **2 Campaign Dashboard**
Displays active marketing campaigns.

-----
# **Campaign Stats**
Active Campaigns\
Coupons Used Today\
Referral Signups\
Campaign Revenue

Example:

Active Campaigns: 5\
Coupons Used: 340\
Referral Users: 120

-----
# **Campaign Fields**
Campaign ID\
Campaign Name\
Campaign Type\
Start Date\
End Date\
Status

Example:

Campaign #101\
Summer Sale\
Discount Campaign\
Active

-----
# **Campaign Types**
Discount Campaign\
Referral Campaign\
Seasonal Offer\
Vendor Promotion

-----
# **Campaign Actions**
Create Campaign\
Edit Campaign\
Pause Campaign\
Delete Campaign

-----
# **Campaign Data Model**
campaign\_id\
campaign\_name\
campaign\_type\
start\_date\
end\_date\
status

-----
# **3 Coupon Management**
## **Page URL**
/admin/marketing/coupons

-----
# **Coupon Fields**
Coupon Code\
Discount Type\
Discount Value\
Minimum Order\
Usage Limit\
Expiry Date\
Status

Example:

SAVE50\
Flat ₹50\
Min Order ₹300\
Expiry: July 1

-----
# **Discount Types**
Flat Discount\
Percentage Discount\
Free Delivery\
Buy 1 Get 1

-----
# **Coupon Actions**
Create Coupon\
Edit Coupon\
Deactivate Coupon\
Delete Coupon

-----
# **Coupon Data Model**
coupon\_id\
coupon\_code\
discount\_type\
discount\_value\
minimum\_order\
expiry\_date\
usage\_limit

-----
# **4 Referral Program**
Allows users to invite friends.

-----
# **Referral Workflow**
1 User shares referral code\
2 Friend signs up\
3 Friend completes first order\
4 Both receive reward

-----
# **Referral Fields**
referral\_code\
referrer\_user\_id\
referred\_user\_id\
reward\_amount\
status

Example:

Code: AB123\
Reward: ₹100

-----
# **Referral Rewards**
Wallet Credit\
Discount Coupon\
Free Delivery

-----
# **5 Advertisement Management**
Allows vendors to promote listings.

-----
# **Page URL**
/admin/marketing/ads

-----
# **Ad Fields**
Ad ID\
Vendor Name\
Ad Type\
Ad Placement\
Start Date\
End Date\
Status

Example:

Ad #2001\
Bob's Burgers\
Homepage Banner\
Active

-----
# **Ad Placement Locations**
Homepage Banner\
Restaurant Listing\
Grocery Listing\
Service Listing

-----
# **Ad Types**
Banner Ad\
Featured Listing\
Sponsored Result

-----
# **Ad Actions**
Create Ad\
Edit Ad\
Pause Ad\
Delete Ad

-----
# **6 Featured Listings**
Allows vendors to appear at the top.

-----
# **Example**
Featured Restaurants\
Featured Grocery Stores\
Featured Services

-----
# **Featured Listing Fields**
listing\_id\
vendor\_id\
feature\_start\_date\
feature\_end\_date\
priority

-----
# **7 Campaign Analytics**
Tracks marketing performance.

-----
# **Metrics**
Campaign Revenue\
Coupon Usage\
Referral Conversions\
Ad Click Rate

Example:

Coupon SAVE50 used 1,200 times\
Campaign Revenue: ₹3,40,000

-----
# **Filters**
Campaign\
Date Range\
City\
Service Type

-----
# **API Endpoints**
### **Create Coupon**
POST /admin/marketing/coupons

-----
### **Get Campaigns**
GET /admin/marketing/campaigns

-----
### **Create Advertisement**
POST /admin/marketing/ads

-----
### **Get Campaign Analytics**
GET /admin/marketing/analytics

-----
# **Database Tables Used**
campaigns\
coupons\
referrals\
advertisements\
featured\_listings\
coupon\_usage

-----
# **Security Requirements**
validate coupon usage\
prevent coupon abuse\
secure campaign configuration

-----
# **Performance Requirements**
Campaign analytics load time:

< 3 seconds

Coupon validation time:

< 500 ms

**Analytics Dashboard Specification**

**Module Name**

Analytics Dashboard

**Purpose**

The Analytics Dashboard provides insights into platform performance, user growth, orders, rides, revenue, and operational metrics. It helps administrators make data-driven decisions and monitor business growth.

-----
**Dashboard URL**

/admin/analytics

-----
**Dashboard Layout Structure**

1 Sidebar Navigation\
2 Top Navigation Bar\
3 Platform Overview Metrics\
4 Order Analytics\
5 Ride Analytics\
6 Service Analytics\
7 User Growth Analytics\
8 Revenue Analytics\
9 Vendor Performance\
10 Driver / Delivery Performance\
11 Export Reports

-----
**1 Sidebar Navigation**

Dashboard\
Orders Analytics\
Rides Analytics\
Service Analytics\
User Growth\
Revenue Analytics\
Vendor Performance\
Driver Performance\
Delivery Partner Performance\
Reports Export\
Logout

-----
**2 Top Navigation Bar**

Components:

Admin Name\
Date Filter\
City Filter\
Service Filter\
Profile Menu

Example:

Super Admin

-----
**3 Platform Overview Metrics**

Shows key platform stats.

-----
**Metrics Cards**

Total Users\
Total Orders\
Total Rides\
Total Service Bookings\
Total Revenue\
Active Vendors\
Active Drivers\
Active Delivery Partners

Example:

Users: 50,000\
Orders Today: 1,200\
Rides Today: 540\
Revenue Today: ₹3,40,000

-----
**4 Order Analytics**

**Page URL**

/admin/analytics/orders

-----
**Order Metrics**

Orders Per Hour\
Orders Per Day\
Average Order Value\
Order Success Rate\
Order Cancellation Rate

Example:

Orders Today: 1,200\
Average Order Value: ₹280\
Cancellation Rate: 3%

-----
**Order Charts**

Orders Trend Graph\
Top Selling Restaurants\
Top Selling Grocery Stores\
Peak Order Hours

-----
**5 Ride Analytics**

**Page URL**

/admin/analytics/rides

-----
**Ride Metrics**

Ride Requests\
Completed Rides\
Cancelled Rides\
Average Ride Distance\
Average Ride Fare

Example:

Ride Requests Today: 540\
Completed Rides: 510\
Average Fare: ₹120

-----
**Ride Charts**

Ride Demand Graph\
Peak Ride Hours\
Top Pickup Locations\
Top Drop Locations

-----
**6 Service Analytics**

**Page URL**

/admin/analytics/services

-----
**Service Metrics**

Total Service Bookings\
Most Popular Services\
Average Service Price\
Service Completion Rate

Example:

AC Repair Bookings: 150\
Plumbing Services: 120

-----
**Service Charts**

Service Demand Graph\
Top Service Categories\
City-wise Service Demand

-----
**7 User Growth Analytics**

**Page URL**

/admin/analytics/users

-----
**User Metrics**

New User Signups\
Daily Active Users\
Monthly Active Users\
User Retention Rate

Example:

New Users Today: 420\
DAU: 12,000\
MAU: 38,000

-----
**User Growth Charts**

User Growth Graph\
Signup Trends\
Retention Graph

-----
**8 Revenue Analytics**

**Page URL**

/admin/analytics/revenue

-----
**Revenue Metrics**

Total Revenue\
Food Revenue\
Ride Revenue\
Service Revenue\
Platform Commission

Example:

Food Revenue: ₹2,00,000\
Ride Revenue: ₹80,000\
Service Revenue: ₹60,000

-----
**Revenue Charts**

Revenue Trend Graph\
Daily Revenue\
Monthly Revenue\
Revenue by Service Type

-----
**9 Vendor Performance**

**Page URL**

/admin/analytics/vendors

-----
**Vendor Metrics**

Total Orders\
Average Rating\
Revenue Generated\
Order Completion Rate

Example:

Bob's Burgers\
Orders: 1,200\
Rating: ⭐4.6\
Revenue: ₹3,20,000

-----
**Vendor Charts**

Top Vendors\
Vendor Revenue Ranking\
Vendor Order Trends

-----
**10 Driver / Delivery Performance**

**Page URL**

/admin/analytics/drivers

-----
**Driver Metrics**

Trips Completed\
Average Rating\
Average Earnings\
Trip Completion Rate

Example:

Driver: Amit\
Trips: 450\
Rating: ⭐4.8\
Earnings: ₹32,000

-----
**Delivery Partner Metrics**

Deliveries Completed\
Average Delivery Time\
Average Rating\
Earnings

-----
**11 Export Reports**

Admins can export analytics reports.

-----
**Export Formats**

CSV\
Excel\
PDF

-----
**Export Fields**

Date Range\
City\
Service Type\
Vendor\
Driver

-----
**API Endpoints**

**Get Order Analytics**

GET /admin/analytics/orders

-----
**Get Revenue Analytics**

GET /admin/analytics/revenue

-----
**Get User Analytics**

GET /admin/analytics/users

-----
**Export Reports**

GET /admin/analytics/export

-----
**Database Tables Used**

users\
orders\
rides\
service\_bookings\
vendors\
drivers\
delivery\_partners\
payments

-----
**Security Requirements**

role-based access\
data privacy protection\
secure report downloads

-----
**Performance Requirements**

Dashboard load time:

< 2 seconds

Report generation time:

< 5 seconds

-----
✅ **Abdu, ab tumhare platform ka almost complete system PRD ready ho gaya**:

Major systems covered:

- Customer App 
- Food Module 
- Grocery Module 
- Home Services 
- Ride Services 
- Cart & Checkout 
- Order Tracking 
- Vendor Dashboard 
- Delivery Partner App 
- Driver App 
- Operational Admin 
- Super Admin 
- Customer Care 
- Verification / KYC 
- Finance / Payout 
- Notification System 
- Marketing / Promotions 
- Analytics Dashboard

\
\
**Credentials**

**Firebase account :** 

**~~User id: [**~~dreamsai5825@gmail.com~~**](mailto:dreamsai5825@gmail.com)~~** 

**~~Password: Zayan2629@~~**

**~~Operational admin: [**~~dreamsai5825@gmail.com~~**](mailto:dreamsai5825@gmail.com)~~**                       //testing only

Password:Qwerty7890@

Other id: nothing assigned everything for now assigned by the ai for the below ids

<gour.ayaz23@gmail.com>

<mdayazgour1512000@gmail.com>

<mohammadayaz4217@gmail.com>	

<a.gou.bca.agi@gmail.com>



