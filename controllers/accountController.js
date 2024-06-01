const accountModel = require("../models/account-model");
const messageModel = require("../models/message-model")
const utilities = require("../utilities/");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Login
 * *************************************** */
async function loginAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.loginAccount(
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash("success", "You're logged in!");
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("error", "Login failed.");
    res.status(501).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }
}

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const {
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    } = req.body;

    // Generar hash de la contraseña
    const hashedPassword = await bcrypt.hash(account_password, 10);

    // Registrar la cuenta
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult.rowCount) {
      req.flash(
        "success",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      return res.status(201).redirect("/account/account");
    } else {
      req.flash("error", "Sorry, the registration failed.");
      return res.status(500).render("account/register", {
        title: "Register",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    next(error); // Pasar el error al siguiente middleware
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/account");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}
/* ****************************************
 *  Deliver default account view
 *  (get (route = account/) == (view = account/account))
 * *************************************** */
async function buildAccount(req, res, next) {
  try {
    let nav = await utilities.getNav();
    let unreadMessages = await messageModel.getUnreadMessageCountByAccountId(res.locals.accountData.account_id)
    res.render("account/account", {
      title: "Account",
      nav,
      errors: null,
      unreadMessages
    });
  } catch (error) {
    next(error); // Pasar el error al siguiente middleware
  }
}

/* ****************************************
 *  Deliver edit account information view
 * *************************************** */
async function buildEditAccount(req, res, next) {
  let nav = await utilities.getNav();
  let account = res.locals.accountData;
  const account_id = parseInt(req.params.account_id);
  console.log("Hellooooo build editaccount", account_id);
  res.render("account/editaccount", {
    title: "Edit Account Information",
    nav,
    errors: null,
    account_firstname: account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
    account_id: account_id,
  });
}

/* ****************************************
 *  Process updated account info (post /editaccount)
 * *************************************** */
async function editAccountInfo(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;

  // pass (fname, lname, email) to model UPDATE statement
  const regResult = await accountModel.updateAccountInfo(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );
  if (regResult) {
    // flash message that the update was successful
    res.clearCookie("jwt");
    const accountData = await accountModel.getAccountById(account_id);
    // use .env secret key to sign, expires in one hour
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 3600 * 1000,
    });
    // can only be passed through http requests, maximum age is 1 hour
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });

    req.flash(
      "success",
      `Congratulations, ${account_firstname} you\'ve succesfully updated your account info.`
    );
    res.status(201).render("account/account", {
      title: "Edit Account Information",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
  } else {
    req.flash("error", "Sorry, the update failed.");
    // render account edit view again
    res.status(501).render("account/editaccount", {
      title: "Edit Account Information",
      nav,
      errors: null,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email,
    });
  }
}

/* ****************************************
*  Process updated password (post /editpassword)
* *************************************** */
async function editAccountPassword(req, res) {
  let nav = await utilities.getNav();
  const { account_password, account_id } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    return res.status(500).render("account/editaccount", {
      title: "Edit Account Information",
      nav,
      errors: null,
    });
  }

  // pass (hashpass, account_id) to model UPDATE statement
  const regResult = await accountModel.changeAccountPassword(hashedPassword, account_id);

  if (regResult) {
    const account = await accountModel.getAccountById(account_id);
    req.flash("success", `Congratulations, ${account.account_firstname}, you've successfully updated your account info.`);
    return res.status(201).render("account/account", {
      title: "Account Information",
      nav,
      errors: null,
      account_firstname: account.account_firstname,
    });
  } else {
    const account = await accountModel.getAccountById(account_id);
    req.flash("error", "Sorry, the update failed.");
    return res.status(501).render("account/editaccount", {
      title: "Edit Account Information",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Logout user
 * *************************************** */
async function logoutAccount(req, res, next) {
  res.clearCookie("jwt");
  res.redirect("/");
  return;
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  loginAccount,
  accountLogin,
  buildAccount,
  buildEditAccount,
  editAccountInfo,
  editAccountPassword,
  logoutAccount
};
