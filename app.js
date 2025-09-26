const usernameInput = document.getElementById("usernameInput");
const searchBtn = document.getElementById("searchBtn");
const profile = document.getElementById("profile");
const error = document.getElementById("error");

const avatar = document.getElementById("avatar");
const nameEl = document.getElementById("name");
const bio = document.getElementById("bio");
const followers = document.getElementById("followers");
const following = document.getElementById("following");
const repos = document.getElementById("repos");
const repoList = document.getElementById("repoList");
const followBtn = document.getElementById("followBtn");

let timeout;

usernameInput.addEventListener("input", () => {
  clearTimeout(timeout);
  const username = usernameInput.value.trim();
  if (username) {
    timeout = setTimeout(() => fetchProfile(username), 500);
  } else {
    profile.classList.add("hidden");
    error.classList.add("hidden");
  }
});

searchBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (username) fetchProfile(username);
});

async function fetchProfile(username) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (res.status === 404) throw "User not found";
    const data = await res.json();

    avatar.src = data.avatar_url;
    nameEl.textContent = data.name || data.login;
    bio.textContent = data.bio || "No bio available ";
    followers.textContent = data.followers;
    following.textContent = data.following;
    repos.textContent = data.public_repos;

    followBtn.onclick = () => {
      window.open(`https://github.com/${username}`, "_blank");
    };

    fetchRepos(username);

    profile.classList.remove("hidden");
    error.classList.add("hidden");
  } catch (err) {
    profile.classList.add("hidden");
    error.classList.remove("hidden");
  }
}

async function fetchRepos(username) {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`
    );
    const data = await res.json();
    repoList.innerHTML = "";
    data.forEach((repo) => {
      const a = document.createElement("a");
      a.href = repo.html_url;
      a.target = "_blank";
      a.textContent = repo.name;
      repoList.appendChild(a);
    });
  } catch (err) {
    console.error(err);
  }
}
