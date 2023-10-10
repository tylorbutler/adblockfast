import { Settings } from './domain/settings';

chrome.runtime.onInstalled.addListener(async () => {
  const enabledRulesets =
    await chrome.declarativeNetRequest.getEnabledRulesets();
  console.log(`Enabled rulesets: ${enabledRulesets}`);

  const staticRuleCount =
    await chrome.declarativeNetRequest.getAvailableStaticRuleCount();
  console.log(`Available static rule count: ${staticRuleCount}`); // TODO: 329,996 rules?

  Settings.getInstance().setBlockingEnabled(true);
});

chrome.declarativeNetRequest.setExtensionActionOptions({
  displayActionCountAsBadgeText: true,
});

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((e) => {
  //(e.request.url); // TODO: Only for debugging
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') {
    return;
  }

  const getIconPaths = (isBlockingEnabled) => {
    const iconPath = isBlockingEnabled ? 'blocked-ads' : 'blocked';

    return {
      19: `img/${iconPath}/19.png`,
      38: `img/${iconPath}/38.png`,
    };
  };

  const isBlockingEnabled = await Settings.getInstance().isBlockingEnabled();

  chrome.action.setIcon({
    path: getIconPaths(isBlockingEnabled),
    tabId: tabId,
  });
});
