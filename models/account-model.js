const pool = require("../database/");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
    return result;
  } catch (error) {
    console.error("Error en registerAccount:", error.message);
    throw new Error(error.message);
  }
}

/* *****************************
 *   Login existing account
 * *************************** */
async function loginAccount(account_email, account_password) {
  try {
    const sql =
      "SELECT * FROM account WHERE account_email = $1 AND account_password = $2";
    const accountMatch = await pool.query(sql, [
      account_email,
      account_password,
    ]);
    return accountMatch.rows;
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for correct password
 * ********************* */
async function checkAccountPassword(account_email, account_password) {
  try {
    // selects rows that match both the email AND password, returns row count
    // 1 true, 0 false

    const sql =
      "SELECT * FROM account WHERE account_email = $1 AND account_password = $2";
    // console.log(account_email)
    // console.log(account_password)

    const attemptMatch = await pool.query(sql, [
      account_email,
      account_password,
    ]);
    // console.log(attemptMatch)
    return attemptMatch.rowCount;
  } catch (error) {
    // console.log("HELLOOOO", error)
    return error.message;
  }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

/* *****************************
 * Return account data using email address
 * Used for logging in, func == accountLogin (desired output == 1)
 * ***************************** */
async function getAccountById(account_id) {
  try {
    // get account info on account_id, returns 0 or 1 AND all account info
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1",
      [account_id]
    );

    return result.rows[0];
  } catch (error) {
    // return if rows == 0
    return new Error("No matching account found");
  }
}

/* *****************************
 * Update account data on id (desired output == 1)
 * ***************************** */
async function updateAccountInfo(
  account_firstname,
  account_lastname,
  account_email,
  account_id
) {
  try {
    // get account info on account_id, returns all account info
    const result = await pool.query(
      "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4",
      [account_firstname, account_lastname, account_email, account_id]
    );
    return result.rowCount;
  } catch (error) {
    // return if update fails
    console.error("updateaccountinfo error " + error);
  }
}

/* *****************************
 * Change account password on account_id (desired output == 1)
 * ***************************** */
async function changeAccountPassword(account_password, account_id) {
  try {
    // get account info on account_id, returns all account info
    const result = await pool.query(
      "UPDATE account SET account_password = $1 WHERE account_id = $2",
      [account_password, account_id]
    );
    return result.rowCount;
  } catch (error) {
    // return if update fails
    console.error("changeaccountpassword error " + error);
  }
}

/* *****************************
*   Get all accounts (SELECT)
* *************************** */
async function getAccounts() {
  return await pool.query("SELECT * FROM public.account ORDER BY account_email")
}


module.exports = {
  registerAccount,
  loginAccount,
  checkExistingEmail,
  checkAccountPassword,
  getAccountByEmail,
  getAccountById,
  updateAccountInfo,
  changeAccountPassword,
  getAccounts
};
