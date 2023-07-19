"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

// Adds star markup if there is a current user
function addStarMarkUp(story) {
  if (!currentUser) {
    return "";
  }

  const isFavorited = currentUser.favorites.find(
    (favorite) => favorite.storyId === story.storyId
  )
    ? "fas"
    : "far";

  return `<span class='star'><i class='${isFavorited} fa-star'></i></span>`;
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story along with the favorite/unfavorite star markup if there is a logged in user.
 */

function generateStoryMarkup(story) {
  const hostName = story.getHostName();

  return $(`
      <li id="${story.storyId}">
        ${addStarMarkUp(story)}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <div class="story-author">by ${story.author}</div>
        <div class="story-user">posted by ${story.username}</div>
      </li> 
      <hr>
    `);
}

// Generates a separate story markup for "my stories". This allows us to only add the trash-can markup to stories submitted by the user and being viewed in "my stories".
function generateMyStoryMarkup(story) {
  const storyMarkUp = generateStoryMarkup(story);

  storyMarkUp
    .find(".star")
    .before("<span class='trash-can'><i class='fas fa-trash-alt'></i></span>");

  return storyMarkUp;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Handles submitting a new story form
async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  // gathers info from form
  const author = $("#submit-author").val();
  const title = $("#submit-title").val();
  const url = $("#submit-url").val();
  const username = currentUser.username;
  const story = { title, url, author, username };

  const newStory = await storyList.addStory(currentUser, story);

  const storyMarkUp = generateStoryMarkup(newStory);

  $myStoriesList.prepend(storyMarkUp);

  putStoriesOnPage();

  // hides and resets submit form
  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}

$submitForm.on("submit", submitNewStory);

// Handles deleting a submitted story
async function handleDeleteStory(evt) {
  console.debug("handleDeleteStory");

  const target = $(evt.target);
  const storyId = target.parents("li").attr("id");

  await storyList.deleteStory(currentUser, storyId);

  myStoriesList();
}

$myStoriesList.on("click", ".trash-can", handleDeleteStory);

// Favorite/unfavorite a story
async function favoriteStory(evt) {
  console.debug("favoriteStory");

  const target = $(evt.target);
  const storyId = target.parents("li").attr("id");
  const story = storyList.stories.find((story) => story.storyId === storyId);

  if (target.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    target.toggleClass(["fas", "far"]);
  } else {
    await currentUser.addFavorite(story);
    target.toggleClass(["fas", "far"]);
  }
}

$(".stories-list").on("click", ".star", favoriteStory);

// Creates favorite list on page by looping through the users favorite stories and generating an html for them
function favoritesList() {
  console.debug("favoriteList");

  $favoritedStoriesList.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStoriesList.append("<p>No favorites added!</p>");
  }

  for (let story of currentUser.favorites) {
    const storyMarkUp = generateStoryMarkup(story);

    $favoritedStoriesList.append(storyMarkUp);
  }
}

// creates My Stories list by looping through users own stories and generating an html for them
function myStoriesList() {
  console.debug("myStoriesList");

  $myStoriesList.empty();

  if (currentUser.ownStories.length === 0) {
    $myStoriesList.append("<p>No stories added by user yet!</p>");
  }

  for (let story of currentUser.ownStories) {
    const storyMarkUp = generateMyStoryMarkup(story);

    $myStoriesList.append(storyMarkUp);
  }
}
