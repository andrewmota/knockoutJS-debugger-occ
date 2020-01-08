const functions = {
    getKnockoutInfo: function (shouldSerialize) {
        let ko = window.ko;
    
        if (!ko) {
            if (typeof window.require === 'function') {
                const isDefinedAvailable = typeof window.require.defined === 'function';
                try {
                    if ((isDefinedAvailable && require.defined('ko')) || !isDefinedAvailable) ko = require('ko');
                } catch (e) { }
                if (!ko) {
                    try {
                        if ((isDefinedAvailable && require.defined('knockout')) || !isDefinedAvailable) ko = require('knockout');
                    } catch (e) { }
                }
            }
            if (!ko) return { error: "knockout.js is not used in the page (ko is undefined). Maybe you are using iFrames, if so, browse to the url of the frame and try again." };
        }
    
        const isString = function (obj) { return toString.call(obj) == '[object String]' };
        const isFunction = function (functionToCheck) { return functionToCheck && {}.toString.call(functionToCheck) == '[object Function]' };
        const sortObject = function (obj) { 
            let ordered = {};
            Object.keys(obj).sort().forEach(function (key) { ordered[key] = obj[key] });
            return ordered;
        };
    
        const context = $0 ? ko.contextFor($0) : {};
        let copy = { __proto__: null };
        let copy2 = { __proto__: null };

        try {
            const props = Object.getOwnPropertyNames(context).sort();

            props.forEach(function (prop) {
                const data = sortObject(context[prop]);
                
                if (prop === "$index")
                    copy["$index()"] = ko.utils.unwrapObservable(data);
                else if (prop === "$cell")
                    copy[prop] = shouldSerialize ? ko.toJS(data) : ko.utils.unwrapObservable(data);
                else if (prop === "$root") {
                    if (data != window) {
                        try {
                            if (shouldSerialize)
                                copy["$root_toJS"] = ko.toJS(data);
                            else
                                copy["$root"] = data;
                        }
                        catch (toJsErr) {
                            copy["$root_toJS"] = "Error: ko.toJS(" + prop + ")";
                            copy["$root_toJS_exc"] = toJsErr;
                        }
                    } else
                        copy["$root"] = "(Global window object)";
                } else
                    copy[prop] = ko.utils.unwrapObservable(data);
            });
        } catch (err) {
            return { info: "Please select a dom node with ko data.", ExtensionError: err };
        }
    
        try {
            const dataFor = $0 ? ko.dataFor($0) : {};
            const data = shouldSerialize ? ko.toJS(dataFor) : ko.utils.unwrapObservable(dataFor);
            
            if (!isString(data)) {
                try {
                    var props2 = Object.getOwnPropertyNames(data);
                    props2 = props2.sort();
                    for (i = 0; i < props2.length; ++i) {
                        copy2[props2[i]] = ko.utils.unwrapObservable(data[props2[i]]);
                        if (shouldSerialize && !isFunction(data[props2[i]])) 
                            copy[props2[i]] = data[props2[i]];
                        else if (!shouldSerialize)
                            copy[props2[i]] = ko.utils.unwrapObservable(data[props2[i]]);
                    }
                    copy.vm_toJS = copy2;
                } catch (err) {
                    copy.vm_no_object = data;
                }
            } else 
                copy.vm_string = data;
        } catch (error) {
            copy.error = error;
        }
        
        return copy;
    },

    updateElementProperties: function (sidebar, shouldDoKOtoJS) {
        sidebar.setExpression("(" + functions.getKnockoutInfo.toString() + ")(" + shouldDoKOtoJS + ")");
    },
};
const config = {
    PLUGIN_TITLE : "KnockoutJS - OCC",
    KO_TO_JS: "shouldDoKOtoJS",
    KO_TO_JS_SELECTOR: "#shouldDoKOtoJSCheckbox",
};

export { functions, config };