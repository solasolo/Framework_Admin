define(function (require, exports, module) {
    "use strict";

    function Children(node, func) {
        var children = node.childNodes;

        if (children) {
            for (var i = 0; i < children.length; i++) {
                var n = children[i];
                if (n.nodeType == 3) {
                    continue;
                } else {
                    var tag = n.tagName ? n.tagName.toUpperCase() : "";
                    func(tag, n);
                }
            }
        }
    }

    function WalkTable(node, data) {
        Children(node, function (tag, n) {
            if (tag === 'TR') {
                WalkRow(n, data);
            } else if (tag === 'THEAD' || tag === 'TBODY') {
                WalkTable(n, data);
            }
        });
    }

    function WalkRow(node, data) {
        var row = [];

        Children(node, function (tag, n) {
            if (tag === 'TD' || tag === 'TH') {
                row.push(n.innerText);
            }
        });

        data.push(row);
    }

    var Table = {
        Export: function(node) {
            var data = [];
            WalkTable(node, data);
      
            return data;
        }
    };

    module.exports = Table;
});