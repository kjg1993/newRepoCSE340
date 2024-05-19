const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
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
    const sql = "SELECT * FROM account WHERE account_email = $1 AND account_password = $2"
    const accountMatch = await pool.query(sql, [account_email, account_password])
    return accountMatch.rows
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for correct password
 * ********************* */
async function checkAccountPassword(account_email, account_password){
  try {
    // selects rows that match both the email AND password, returns row count
    // 1 true, 0 false

    const sql = "SELECT * FROM account WHERE account_email = $1 AND account_password = $2"
    // console.log(account_email)
    // console.log(account_password)

    const attemptMatch = await pool.query(sql, [account_email, account_password])
    // console.log(attemptMatch)
    return attemptMatch.rowCount
  } catch (error) {
    // console.log("HELLOOOO", error)
    return error.message
  }
}

module.exports = {registerAccount, loginAccount, checkExistingEmail, checkAccountPassword}
