const REDIRECT = [
  {
    match: "https://brainly.com/moderation_new/view_moderator/",
    url: "https://brainly.com/companion/moderator/"
  }
];

let page = window.location.href;
REDIRECT.forEach(({ url, match }) => {
  let id = page.replace(match, "").split("/")[1].split("?")[0];

  if (page.includes(match)) {
    window.location.href = url + id;
  }
});