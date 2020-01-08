import { functions, config } from "./utils.js";
const { updateElementProperties } = functions;

const shouldDoKOtoJSValue = localStorage.getItem(config.KO_TO_JS);
const shouldDoKOtoJS = shouldDoKOtoJSValue ? JSON.parse(shouldDoKOtoJSValue) : true;
chrome.devtools.panels.elements.createSidebarPane(config.PLUGIN_TITLE, function (sidebar) {
    updateElementProperties(sidebar, shouldDoKOtoJS);

    chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties.bind(this, sidebar, shouldDoKOtoJS));
    sidebar.onShown.addListener(updateElementProperties.bind(this, sidebar, shouldDoKOtoJS));

    chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
        updateElementProperties(sidebar, shouldDoKOtoJS);
    });
});