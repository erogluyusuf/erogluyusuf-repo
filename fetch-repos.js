const fs = require("fs");
const https = require("https");

const username = "erogluyusuf"; // GitHub kullanıcı adın
const maxRepos = 5; // Gösterilecek en fazla repo sayısı

function fetchRepos(callback) {
  const options = {
    hostname: "api.github.com",
    path: `/users/${username}/repos?sort=updated`,
    method: "GET",
    headers: { "User-Agent": "Node.js" }
  };

  const req = https.request(options, (res) => {
    let body = "";
    res.on("data", (chunk) => (body += chunk));
    res.on("end", () => callback(JSON.parse(body)));
  });

  req.on("error", (e) => console.error(e));
  req.end();
}

fetchRepos((repos) => {
  const list = repos
    .slice(0, maxRepos)
    .map(
      (repo) =>
        `- [${repo.name}](${repo.html_url}): ${repo.description || "Açıklama yok"}`
    )
    .join("\n");

  const readme = fs.readFileSync("README.md", "utf-8");
  const updated = readme.replace(
    /<!--START_SECTION:repos-->[\s\S]*<!--END_SECTION:repos-->/,
    `<!--START_SECTION:repos-->\n${list}\n<!--END_SECTION:repos-->`
  );

  fs.writeFileSync("README.md", updated);
});
