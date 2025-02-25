async function fetchInstagramData(username) {
  const proxyUrl = "https://api.allorigins.win/raw?url=";
  const instaUrl = `https://www.instagram.com/${username}/`;

  try {
    const response = await fetch(proxyUrl + encodeURIComponent(instaUrl));
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const html = await response.text();

    // Extract JSON data using regex
    const jsonMatch = html.match(/<script type="application\/ld\+json">({.*?})<\/script>/);
    if (!jsonMatch) {
      throw new Error("Could not find JSON data in HTML");
    }

    const jsonData = JSON.parse(jsonMatch[1]);

    // Construct structured profile data
    const profileData = {
      username: jsonData.identifier,
      fullName: jsonData.name,
      profilePicture: jsonData.image,
      bio: jsonData.description || "",
      postsCount: jsonData.mainEntityofPage.interactionStatistic[0].userInteractionCount || 0,
      followersCount: jsonData.mainEntityofPage.interactionStatistic[1].userInteractionCount || 0,
      followingCount: jsonData.mainEntityofPage.interactionStatistic[2].userInteractionCount || 0,
      posts: [],
    };

    console.log("Extracted Data:", profileData);
    return profileData;

  } catch (error) {
    console.error("Error fetching Instagram data:", error);
    return null;
  }
}

// 🔥 **Test it with your username**
fetchInstagramData("pers0n4l_jesus").then(data => console.log(data));