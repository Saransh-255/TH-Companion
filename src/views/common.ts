const REDIRECT = [
  {
    match: "https://brainly.com/moderation_new/view_moderator/",
    url: "https://brainly.com/companion/moderator/"
  },
  // {
  //   match: "https://brainly.com/users/user_content/",
  //   url: "https://brainly.com/companion/user/"
  // }
];

let page = window.location.href;
console.log(page, "page");
REDIRECT.forEach(({ url, match }) => {
  let id = page.replace(match, "").split("/")[0]?.split("?")[0] ?? "";

  if (page.includes(match)) {
    window.location.href = url + id;
  }
});