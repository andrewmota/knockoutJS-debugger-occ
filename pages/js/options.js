import { config } from "./utils.js";

const restorePreviousSettings = function() {
    const checkBoxes = [
        {
            settingKey: config.KO_TO_JS, 
            domSelector: config.KO_TO_JS_SELECTOR, 
            defaultValue: true 
        },
    ];
    checkBoxes.forEach(function(box) {
        const localStorageValue = localStorage.getItem(box.settingKey);
        const settingValue = localStorageValue ? JSON.parse(localStorageValue) : box.defaultValue;
        $(box.domSelector).prop('checked', settingValue);
    });
};

const setValueSafelyInLocalStorage = function(key, notStringifiedValue) {
    try {
        localStorage.setItem(key, JSON.stringify(notStringifiedValue));
        $("#infoMessage").closest(".alert").removeClass("alert-error");
        $("#infoMessage").closest(".alert").find("h4").text("Saved");
    } catch (e) {
        $infoMessage.html("Unable to change the setting. Probably because you have blocked localstorage/cookies in the privacy settings of Chrome.");
        $("#infoMessage").closest(".alert").removeClass("alert-success").addClass("alert-error");
        $("#infoMessage").closest(".alert").find("h4").text("Error");
    }
};

restorePreviousSettings();

$(config.KO_TO_JS_SELECTOR).change(function() {
    const el = $(this);
    const val = el.is(':checked');
    setValueSafelyInLocalStorage(shouldDoKOtoJSKey, val);
});