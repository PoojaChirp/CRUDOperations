# CRUDOperations

This project is a **Node.js script** that consumes the public **GoREST Users API** and generates CSV reports based on user email data.

The script fetches all users from the API (handling pagination automatically) and produces two CSV reports:

1. **Active users with `.test` email addresses**
2. **Email domain suffix counts for all users**

---

## API Used

* **Endpoint:**
  `https://gorest.co.in/public/v2/users`

* **Documentation:**
  [https://gorest.co.in](https://gorest.co.in)

---

## Features

* Fetches all users using API pagination
* No third-party dependencies
* Uses built-in Node.js `fetch` and `fs`
* Outputs clean, ready-to-use CSV files
* Includes error handling for API failures

---

## Requirements

* **Node.js v18 or higher**

> Node 18+ is required because it includes the built-in `fetch()` API.

---

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/PoojaChirp/CRUDOperations.git
cd CRUDOperations
```

---

### 2. Enable ES Modules

This script uses ES module syntax (`import fs from "fs"`).

Ensure your `package.json` contains:

```json
{
  "type": "module"
}
```

If `package.json` does not exist:

```bash
npm init -y
```

Then add `"type": "module"`.

---

## Running the Script

From the project directory:

```bash
node report.js
```

---

## Output Files

After successful execution, two CSV files will be generated in the project directory.

---

### 1️⃣ `active_test_users.csv`

Contains **only active users** whose email ends with `.test`.

**Format:**

```csv
id,email
4478538,dhanadeepa_singh@effertz.test
4478541,anjushree_joshi_ii@monahan.test
```

---

### 2️⃣ `email_domain_counts.csv`

Contains **all users**, grouped by email domain suffix.

**Format:**

```csv
Domain,count
com,4
org,2
io,4
test,6
```

---

## How It Works

### Step 1: Fetch Users

* Calls the GoREST API page by page
* Stops when an empty response is returned
* Collects all users into memory

### Step 2: Generate CSV Reports

* Filters active `.test` users
* Extracts email domain suffixes
* Writes results to CSV files using Node’s `fs` module

---

## Error Handling

* API errors are detected and logged
* Script exits gracefully if a request fails

---

## Why This Solution

* ✔ Meets product requirements exactly
* ✔ No external dependencies
* ✔ Easy to run and review
* ✔ Suitable for interviews, demos, and automation
* ✔ Clean separation of logic and reporting

---

## Future Improvements (Optional)

* Stream CSV output for large datasets
* Add CLI arguments for filters
* Add unit tests
* Schedule report generation (cron)
* Export to JSON or Excel

---

## Author

**Pooja Srinath**
