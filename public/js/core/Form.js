define(function (require, exports, module) {
    "use strict";

    var Utils = require('./Utils');
    var Validator = require('./Validator');

    function WalkChildren(node, fn) {
        var children = node.childNodes;
        if (children) {
            for (var i = 0; i < children.length; i++) {
                var n = children[i];
                if (n.nodeType == 3) continue;

                fn(n);
            }
        }
    }

    function GetValue(obj, name) {
        var value;

        if (name && obj) {
            value = obj[name];
        }

        return value;
    }

    function SetValue(obj, name, value) {
        if (name && obj) {
            if (obj[name] !== undefined) {
                if (!Utils.isArray(obj[name])) {
                    obj[name] = [obj[name]];
                }

                obj[name].push(value);
            } else {
                obj[name] = value;
            }
        }
    }

    function GetDOMValue(node) {
        var value = node.value ||
            node.getAttribute('value') ||
            node.innerText;

        return value;
    }

    function CheckInput(tag, value, result) {
        var ret = true;

        var Name = tag.name || n.getAttribute("data-name");
        var Rule = Name && tag.getAttribute && (tag.getAttribute('rule') || tag.getAttribute('data-rule'));

        if (Rule) {
            var res = Validator.Check(Rule, value);
            if (res) {
                result[Name] = res;
            }

            ret = (res === null);

            if (Form.ShowValidate) { 
                Form.ShowValidate(n, ret);
            }
        }

        return ret;
    }

    var Form = {
        Set: function (node, obj) {
            var me = this;

            WalkChildren(node, function (n) {
                var Name = n.name;
                var Value = null;
                var Tag = n.tagName ? n.tagName.toUpperCase() : "";

                if (Tag === "INPUT" || Tag === "SELECT") {
                    var Type = n.type.toLowerCase();

                    switch (Type) {
                        case "checkbox":
                        case "radio":
                            Value = GetValue(obj, Name);
                            var IsCheck = false;

                            if (Value) {
                                if (Utils.isArray(Value)) {
                                    for (var j = 0; j < Value.length; j++) {
                                        var v = Value[j];
                                        IsCheck |= (n.value == v);
                                    }

                                    n.checked = IsCheck;
                                } else {
                                    n.checked = (n.value == Value);
                                }
                            } else {
                                n.checked = false;
                            }
                            break;

                        default:
                            Value = GetValue(obj, Name);
                            n.value = Value ? Value : "";
                            break;
                    }
                } else if (Tag == "TEXTAREA") {
                    Value = GetValue(obj, Name);
                    n.value = Value ? Value : "";
                    // n.innerText = Value ? Value : "";
                } else if (Tag !== "") {
                    Name = n.getAttribute("name") || n.getAttribute("data-name");

                    if (Name) {
                        Value = GetValue(obj, Name);
                        if (Utils.isArray(Value)) {
                            if (Value.length > 0) {
                                this.Set(n, Value[0]);
                                Value.shift();
                            }
                        } else {
                            me.Set(n, Value);
                        }
                    } else {
                        me.Set(n, obj);
                    }
                }
            });
        },

        Get: function (node, obj) {
            var me = this;
            if (!obj) obj = {};

            WalkChildren(node, function (n) {
                var Value = null;
                var Name = n.name;
                var Tag = n.tagName ? n.tagName.toUpperCase() : "";

                if (Tag === "INPUT" || Tag === "SELECT") {
                    var Type = n.type.toLowerCase();

                    switch (Type) {
                        case "checkbox":
                        case "radio":
                            if (n.checked) {
                                Value = n.value;
                            }
                            break;

                        case "select-multiple": //多选下拉框
                            Value = [];
                            var opts = n.options;
                            for (var j = 0; j < opts.length; j++) {
                                if (opts[j].selected) {
                                    Value.push(opts[j].value);
                                }
                            }
                            break;

                        case "file":
                            Value = n.files;
                            break;

                        default:
                            Value = n.value;
                    }
                    if (Value) {
                        SetValue(obj, Name, Value);
                    }
                } else if (Tag == "TEXTAREA") {
                    Value = n.value;
                    if (Value) {
                        SetValue(obj, Name, Value);
                    }

                } else if (Tag !== "") {
                    Name = n.getAttribute("name") || n.getAttribute("data-name");

                    if (Name) {
                        if (n.children.length > 0) {
                            var subobj = {};
                            SetValue(obj, Name, subobj);
                            me.Get(n, subobj);
                        } else {
                            Value = GetDOMValue(n);
                            if (Value) {
                                SetValue(obj, Name, Value);
                            }
                        }
                    } else {
                        me.Get(n, obj);
                    }
                }
            });

            return obj;
        },

        Validate: function (node, result) {
            var ret = true;
            var me = this;

            WalkChildren(node, function (n) {
                var res = true;
                var Value = null;

                var Tag = n.tagName ? n.tagName.toUpperCase() : "";

                if ((Tag === "INPUT" || Tag === "SELECT")) {
                    Value = n.value;

                    res = CheckInput(n, Value, result);
                } else if (Tag == "TEXTAREA") {
                    // Value = n.innerText;
                    Value = n.value;

                    res = CheckInput(n, Value, result);
                } else if (Tag !== "") {
                    res = me.Validate(n, result);
                }

                ret = ret && res;
            });

            return ret;
        },

        Clean: function (node) {
            var me = this;

            WalkChildren(node, function (n) {
                var Tag = n.tagName ? n.tagName.toUpperCase() : "";

                if (Tag === "INPUT" || Tag === "SELECT") {
                    var Type = n.type.toLowerCase();

                    switch (Type) {
                        case "checkbox":
                        case "radio":
                            var Value = "";
                            var IsCheck = false;

                            if (Value) {
                                if (Utils.isArray(Value)) {
                                    for (var j = 0; j < Value.length; j++) {
                                        IsCheck |= (n.value == "");
                                    }

                                    n.checked = IsCheck;
                                } else {
                                    n.checked = (n.value == "");
                                }
                            } else {
                                n.checked = false;
                            }
                            break;

                        default:
                            n.value = "";
                            break;
                    }
                } else if (Tag == "TEXTAREA") {
                    n.innerText = "";
                } else if (Tag !== "") {
                    me.Clean(n);
                }
            });
        },

        Submit: function (form, url) {
            form.method = "POST";
            //form.enctype = "multipart/form-data";
            form.enctype = "application/x-www-form-urlencoded";
            form.action = url;
            form.submit();
        },
    };

    module.exports = Form;
});