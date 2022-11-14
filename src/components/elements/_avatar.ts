import _icon from "./_icon";

export default (data: {
  id:string,
  avatarURL: string | null
}) => {
  let avatar;
  if (!data.avatarURL === null) { 
    avatar = `<img class="sg-avatar__image sg-avatar sg-avatar--xs" src="${data.avatarURL}" alt="">`; 
  } else {
    avatar = `<div class = "sg-icon sg-icon--icon-gray-40 sg-icon--x24 sg-avatar__icon">${_icon({
      type: "profile", size: "24",
      color: "gray-40"
    }).outerHTML}</div>`;
  }
  return /*html*/ `
    <a href="/profile/user-${data.id}" class="sg-avatar__wrapper-link">
      <div class="sg-avatar sg-avatar--spaced sg-icon--x24">
        <div class="sg-avatar__image sg-avatar__image--icon">
          ${avatar}
        </div>
      </div>
    </a>
  `;
};