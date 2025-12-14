import fs from "fs";

/*
Stores the GoREST users endpoint in one place
Makes the code easier to maintain or update
*/

const BASE_URL = "https://gorest.co.in/public/v2/users";

/**
 * Fetch all users using pagination
 */
async function fetchAllUsers() {
  let users = [];
  let page = 1;

  while (true) {
    /*
    Calls the API for the current page
    Awaits pauses execution until the response arrives
    The response is stored in the response variable
    */
    const response = await fetch(`${BASE_URL}?page=${page}`);
    if (!response.ok) {
      throw new Error(`API error on page ${page}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      break;
    }

    users.push(...data);
    page++;
  }

  return users;
}

/**
 * Question 1:
 * Active users with .test email addresses
 */
function generateActiveTestUsersCSV(users) {
  const header = "id,email\n";

  /*
Keeps only:
Active users
Valid email fields
Emails ending in .test
  */
  const rows = users
    .filter(
      (user) =>
        user.status === "active" &&
        typeof user.email === "string" &&
        user.email.endsWith(".test")
    )
    .map((user) => `${user.id},${user.email}`)
    .join("\n");

  fs.writeFileSync("active_test_users.csv", header + rows);
}

/**
 * Question 2:
 * Count users by email domain suffix (all users)
 */
function generateDomainCountCSV(users) {
  const domainCounts = {};
/*
split("@"): This is a string method that divides the string into an array (list) of substrings, using the "@" symbol as the separator or delimiter.
Using the example "john.doe@example.com", the split function would produce the array ["john.doe", "example.com"].
[1]: This is the index access operator used to retrieve a specific element from the array created by the split() method.
*/
  users.forEach((user) => {
    if (typeof user.email === "string" && user.email.includes("@")) {
      const domain = user.email.split("@")[1];
      const suffix = domain.split(".").pop().toLowerCase();

      domainCounts[suffix] = (domainCounts[suffix] || 0) + 1;
    }
  });

  const header = "Domain,count\n";
  const rows = Object.entries(domainCounts) //Converts the object into key-value pairs
    .map(([domain, count]) => `${domain},${count}`)
    .join("\n");

  fs.writeFileSync("email_domain_counts.csv", header + rows);
}


/*
Additional code clock to add, update and delete users to handling CRUD operations. [NOT PART OF THE ASSIGNMENT]

/**
 * Add a user to the GoRest API
 * @param {string} token - Optional API token for authentication
 * @returns {Promise<Object>} Created user object
 */
async function addUser(token = null) {
  const userData = {
    name: "pooja sri",
    email: "pooja.sri@test1.com",
    gender: "female",
    status: "active"
  };

  const headers = {
    "Content-Type": "application/json"
  };

  // Add authorization header if token is provided
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to add user: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const createdUser = await response.json();
    console.log("User added successfully:", createdUser);
    return createdUser;
  } catch (error) {
    console.error("Error adding user:", error.message);
    throw error;
  }
}

/**
 * Update a user in the GoRest API
 * @param {number} userId - The ID of the user to update
 * @param {Object} userData - User data to update (name, email, gender, status)
 * @param {string} token - Optional API token for authentication
 * @returns {Promise<Object>} Updated user object
 */
async function updateUser(userId, userData, token = null) {
  const headers = {
    "Content-Type": "application/json"
  };

  // Add authorization header if token is provided
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to update user: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const updatedUser = await response.json();
    console.log("User updated successfully:", updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw error;
  }
}

/**
 * Delete a user from the GoRest API
 * @param {number} userId - The ID of the user to delete
 * @param {string} token - Optional API token for authentication
 * @returns {Promise<boolean>} True if deletion was successful
 */
async function deleteUser(userId, token = null) {
  const headers = {};

  // Add authorization header if token is provided
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: "DELETE",
      headers: headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to delete user: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    // DELETE requests typically return 204 No Content on success
    if (response.status === 204 || response.status === 200) {
      console.log(`User ${userId} deleted successfully`);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error deleting user:", error.message);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    const users = await fetchAllUsers();

    generateActiveTestUsersCSV(users);
    generateDomainCountCSV(users);

    console.log("CSV reports generated:");
    console.log("- active_test_users.csv");
    console.log("- email_domain_counts.csv");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
