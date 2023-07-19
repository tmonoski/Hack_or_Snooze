"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".user-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// Shows submit form on top of page and stories underneath on click of "submit"
function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);

  hidePageComponents();
  putStoriesOnPage();
  $submitForm.show();
}

$navSubmit.on("click", navSubmitClick);

// Shows the users favorited stories on click of "favorites"
function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);

  hidePageComponents();
  favoritesList();

  $favoritedStoriesList.show();
}

$navFavorites.on("click", navFavoritesClick);

// Shows the users submitted stories on click of "my stories"
function navMyStoriesClick(evt) {
  console.debug("navMyStoriesClick", evt);

  hidePageComponents();
  myStoriesList();

  $myStoriesList.show();
}

$navMyStories.on("click", navMyStoriesClick);

// Shows the users profile info on click of their username
function navUserProfileClick(evt) {
  console.debug("navUserProfileClick", evt);

  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on("click", navUserProfileClick);
