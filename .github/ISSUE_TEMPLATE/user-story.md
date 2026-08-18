---
name: User Story
about: This template defines a user story
title: ''
labels: ''
assignees: ''

---

**As a** user who wants to donate or find household items for free

**I need** a web platform (GiftLink) where I can list household items I no longer use and search/view items donated by other users, with registration, login, and an editable profile

**So that** I can recycle items in a practical and secure way, reducing waste and avoiding buying new items

### Details and Assumptions
* The application is full-stack: React front-end and Node/Express back-end, using MongoDB (GiftsDB) to store donations (Gifts) and users (Users).
* The interface will include: a home page, a listings page, a navigation bar, a search function, an item details page, a registration page, a login page, and an editable profile page.
* The back-end exposes REST endpoints: `GET /api/gift`, `GET /api/gift/:id`, `POST /api/gift`, `POST /api/auths/register`, `POST /api/auths/login`, `PUT /api/auths/update`, and `GET /api/search`.
* There is an additional sentiment analysis service (`/sentiment`), separate from the main gifts service, used to analyze user comments.
* Authentication will be handled using JSON Web Tokens (JWT) to secure login, registration, and profile updates.
* The search feature must support multiple parameters (e.g., category, name, item condition).
* The application will be containerized with Docker and deployed via CI/CD (GitHub Actions) to Kubernetes and IBM Code Engine.
* The base code (front-end and back-end) is provided via a public GitHub repository; the directory structure must not be changed.
* Development will follow Agile/DevOps practices, including a Kanban board with user stories to track progress.
* Final project evaluation (40 points) can be done via AI-graded review (Option 1) or peer-graded review (Option 2).

### Acceptance Criteria
```gherkin
Given I am an unauthenticated visitor
When I access the GiftLink home page
Then I should see the navigation bar and the listing of items available for donation

Given I am on the listings page
When I use the search function with one or more parameters
Then I should see only the items that match the specified criteria

Given I found an item of interest in the listing
When I click on the item
Then I should be directed to the item's details page with all relevant information

Given I am a new user
When I fill out and submit the registration form with valid data
Then my account should be created and a JWT token should be generated for authentication

Given I already have a registered account
When I enter valid credentials on the login page
Then I should be successfully authenticated and redirected to my logged-in area

Given I am authenticated
When I access my profile page and edit my information
Then the changes should be saved and reflected in my account

Given I am authenticated
When I list a new item for donation
Then the item should be saved in the database (GiftsDB) and displayed in the general listing

Given a comment is submitted about an item
When the sentiment analysis service processes the text
Then the comment's sentiment (positive, negative, or neutral) should be correctly identified
```
