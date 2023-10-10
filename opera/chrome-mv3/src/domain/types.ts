import { getActiveTab } from '../domain/utils';

class BlockingInfo {
  constructor(
    private _matchedRules: number = 0,
    private _activeTabUrl: string = '',
  ) {}

  get matchedRules(): number {
    return this._matchedRules;
  }

  set matchedRules(value: number) {
    this._matchedRules = value;
  }

  get activeTabUrl(): string {
    return this._activeTabUrl;
  }

  set activeTabUrl(url: string) {
    this._activeTabUrl = url;
  }

  static async fetch(): Promise<BlockingInfo> {
    const activeTab: chrome.tabs.Tab | null = await getActiveTab();
    if (activeTab) {
      const result = await chrome.declarativeNetRequest.getMatchedRules({
        tabId: activeTab.id,
      });

      return new BlockingInfo(result.rulesMatchedInfo.length, activeTab.url);
    }
  }
}

export { BlockingInfo };
