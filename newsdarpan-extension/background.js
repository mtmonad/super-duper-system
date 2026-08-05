const RSS_URL = 'https://newsdarpan.in/news-sitemap.xml';
const CHECK_INTERVAL_MINUTES = 5;

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("fetchNews", {
    periodInMinutes: CHECK_INTERVAL_MINUTES
  });
  // Perform an initial fetch on install
  fetchLatestNews();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "fetchNews") {
    fetchLatestNews();
  }
});

async function fetchLatestNews() {
  try {
    const response = await fetch(RSS_URL);
    const text = await response.text();
    // Parse the XML
    // NOTE: This uses a simple regex to extract the first url/loc element,
    // assuming it represents the latest news item.
    // In a real environment, DOMParser would be used, but since service workers
    // don't have DOM access in Manifest V3 without offscreen documents,
    // we use basic string matching for this simple example.

    const locMatch = text.match(/<loc>(.*?)<\/loc>/);
    if (!locMatch || locMatch.length < 2) return;

    const latestUrl = locMatch[1];

    chrome.storage.local.get(['lastSeenUrl'], function(result) {
      if (result.lastSeenUrl !== latestUrl) {
        // We have a new article
        showNotification(latestUrl);
        // Update the last seen URL
        chrome.storage.local.set({ lastSeenUrl: latestUrl });
      }
    });
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}

function showNotification(url) {
  // Extracting a slug or a cleaner name from the URL for the notification body
  // Example URL: https://newsdarpan.in/article/some-slug
  let slug = url.split('/').pop().replace(/-/g, ' ');
  // Decode URI component in case of hindi text
  try {
    slug = decodeURIComponent(slug);
  } catch(e) {}

  chrome.notifications.create(
    url, // Using URL as the notification ID
    {
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "New Article on NewsDarpan",
      message: slug || "Read the latest updates!",
      priority: 2
    }
  );
}

chrome.notifications.onClicked.addListener((notificationId) => {
  // notificationId is the URL
  chrome.tabs.create({ url: notificationId });
  chrome.notifications.clear(notificationId);
});