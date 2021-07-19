'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
	storyList = await StoryList.getStories();
	$storiesLoadingMsg.remove();

	putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
	// console.debug("generateStoryMarkup", story);

	const hostName = story.getHostName();
	return $(`
      <li id="${story.storyId}">
        <span class="fa fa-star"></span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}<i class="fa fa-trash"></i></small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
	console.debug('putStoriesOnPage');

	$allStoriesList.empty();

	// loop through all of our stories and generate HTML for them
	for (let story of storyList.stories) {
		const $story = generateStoryMarkup(story);
		$allStoriesList.append($story);
	}

	$allStoriesList.show();
}

function addNewStory(author, title, url) {
	storyList.addStory(currentUser, { title, author, url });
}
function navAddStoryClick(e) {
	e.preventDefault();
	addNewStory($('#story-author').val(), $('#story-title').val(), $('#story-url').val());

	$('#story-form').hide();
	putStoriesOnPage();
	$('#all-stories-list').show();
}

function makeFavorite(event) {
	let state = $(this).attr('class').split(' ');
	currentUser.updateFavorite($(this).parent().attr('id'), state[2]);
}

function removeFavortie(storyId) {
	$('#all-stories-list').find(`#${storyId}`).find('.fa').removeClass('checked');
}

function checkFavorites(user) {
	user.favorites.map((el, idx) => {
		$('#all-stories-list').find(`#${el.storyId}`).find('.fa').addClass('checked');
	});
}

function deleteStory() {
	console.log('delete');
	const id = $(this).parent().parent().attr('id');

	storyList.deleteStory(currentUser, id);
}

$('#add-story').on('click', navAddStoryClick);
$('#all-stories-list').on('click', '.fa-star', makeFavorite);
$('#all-stories-list').on('click', '.fa-trash', deleteStory);
