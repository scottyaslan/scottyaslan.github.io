
/*
    Data Analytics Toolkit: Explore any data avaialable through a REST service 
    Copyright (C) 2016  Scott Aslan

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/agpl.html>.
 */

(function() {
  var callWithJQuery;

  callWithJQuery = function(pivotModule) {
    if (typeof exports === "object" && typeof module === "object") {
      return pivotModule(require("jquery"), require("d3"));
    } else if (typeof define === "function" && define.amd) {
      return define(["jquery", "d3"], pivotModule);
    } else {
      return pivotModule(jQuery, d3);
    }
  };

  callWithJQuery(function($, d3) {
    var d3_renderers;
    return d3_renderers = {
      Treemap: function(pivotData, opts) {
        var addToTree, color, defaults, height, i, len, ref, result, returnObject, rowKey, tree, treemap, value, width;
        defaults = {
          localeStrings: {},
          d3: {
            width: function() {
              return $(window).width() / 1.4;
            },
            height: function() {
              return $(window).height() / 1.4;
            }
          }
        };
        opts = $.extend(defaults, opts);
        result = $("<div>").css({
          width: opts.d3.width(),
          height: opts.d3.height()
        });
        tree = {
          name: "All",
          children: []
        };
        addToTree = function(tree, path, value) {
          var child, i, len, newChild, ref, x;
          if (path.length === 0) {
            tree.value = value;
            return;
          }
          if (tree.children == null) {
            tree.children = [];
          }
          x = path.shift();
          ref = tree.children;
          for (i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            if (!(child.name === x)) {
              continue;
            }
            addToTree(child, path, value);
            return;
          }
          newChild = {
            name: x
          };
          addToTree(newChild, path, value);
          return tree.children.push(newChild);
        };
        ref = pivotData.getRowKeys();
        for (i = 0, len = ref.length; i < len; i++) {
          rowKey = ref[i];
          value = pivotData.getAggregator(rowKey, []).value();
          if (value != null) {
            addToTree(tree, rowKey, value);
          }
        }
        color = d3.scale.category10();
        width = opts.d3.width();
        height = opts.d3.height();
        treemap = d3.layout.treemap().size([width, height]).sticky(true).value(function(d) {
          return d.size;
        });
        d3.select(result[0]).append("div").style("position", "relative").style("width", width + "px").style("height", height + "px").datum(tree).selectAll(".node").data(treemap.padding([15, 0, 0, 0]).value(function(d) {
          return d.value;
        }).nodes).enter().append("div").attr("class", "node").style("background", function(d) {
          if (d.children != null) {
            return "lightgrey";
          } else {
            return color(d.name);
          }
        }).text(function(d) {
          return d.name;
        }).call(function() {
          this.style("left", function(d) {
            return d.x + "px";
          }).style("top", function(d) {
            return d.y + "px";
          }).style("width", function(d) {
            return Math.max(0, d.dx - 1) + "px";
          }).style("height", function(d) {
            return Math.max(0, d.dy - 1) + "px";
          });
        });
        return returnObject = {
          html: result
        };
      }
    };
  });

}).call(this);

//# sourceMappingURL=d3_renderers.js.map
