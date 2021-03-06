
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
      return pivotModule(require("jquery"), require("c3"));
    } else if (typeof define === "function" && define.amd) {
      return define(["jquery", "c3"], pivotModule);
    } else {
      return pivotModule(jQuery, c3);
    }
  };

  callWithJQuery(function($, c3) {
    var c3_renderers, makeC3Chart;
    makeC3Chart = function(chartOpts) {
      if (chartOpts == null) {
        chartOpts = {};
      }
      return function(pivotData, opts) {
        var agg, base, base1, base2, colKey, colKeys, columns, dataArray, datum, defaults, fullAggName, groupByTitle, h, hAxisTitle, headers, i, j, k, len, len1, len2, numCharsInHAxis, params, ref, renderArea, result, returnObject, rotationAngle, row, rowHeader, rowKey, rowKeys, title, titleText, tree2, vAxisTitle, val, x, y;
        defaults = {
          localeStrings: {
            vs: "vs",
            by: "by"
          },
          c3: {}
        };
        opts = $.extend(true, defaults, opts);
        if ((base = opts.c3).size == null) {
          base.size = {};
        }
        if ((base1 = opts.c3.size).width == null) {
          base1.width = window.innerWidth / 1.4;
        }
        if ((base2 = opts.c3.size).height == null) {
          base2.height = window.innerHeight / 1.4 - 50;
        }
        if (chartOpts.type == null) {
          chartOpts.type = "line";
        }
        rowKeys = pivotData.getRowKeys();
        if (rowKeys.length === 0) {
          rowKeys.push([]);
        }
        colKeys = pivotData.getColKeys();
        if (colKeys.length === 0) {
          colKeys.push([]);
        }
        headers = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = colKeys.length; i < len; i++) {
            h = colKeys[i];
            results.push(h.join("-"));
          }
          return results;
        })();
        rotationAngle = 0;
        fullAggName = pivotData.aggregatorName;
        if (pivotData.valAttrs.length) {
          fullAggName += "(" + (pivotData.valAttrs.join(", ")) + ")";
        }
        if (chartOpts.type === "scatter") {
          dataArray = [];
          hAxisTitle = pivotData.colAttrs.join("-");
          vAxisTitle = pivotData.rowAttrs.join("-");
          ref = pivotData.tree;
          for (y in ref) {
            tree2 = ref[y];
            for (x in tree2) {
              agg = tree2[x];
              datum = {};
              datum[hAxisTitle] = parseFloat(x);
              datum[vAxisTitle] = parseFloat(y);
              datum["tooltip"] = agg.format(agg.value());
              dataArray.push(datum);
            }
          }
        } else {
          numCharsInHAxis = 0;
          for (i = 0, len = headers.length; i < len; i++) {
            x = headers[i];
            numCharsInHAxis += x.length;
          }
          if (numCharsInHAxis > 50) {
            rotationAngle = 45;
          }
          columns = [];
          for (j = 0, len1 = rowKeys.length; j < len1; j++) {
            rowKey = rowKeys[j];
            rowHeader = rowKey.join("-");
            row = [rowHeader === "" ? pivotData.aggregatorName : rowHeader];
            for (k = 0, len2 = colKeys.length; k < len2; k++) {
              colKey = colKeys[k];
              val = parseFloat(pivotData.getAggregator(rowKey, colKey).value());
              if (isFinite(val)) {
                if (val < 1) {
                  row.push(val.toPrecision(3));
                } else {
                  row.push(val.toFixed(3));
                }
              } else {
                row.push(null);
              }
            }
            columns.push(row);
          }
          vAxisTitle = pivotData.aggregatorName + (pivotData.valAttrs.length ? "(" + (pivotData.valAttrs.join(", ")) + ")" : "");
          hAxisTitle = pivotData.colAttrs.join("-");
        }
        titleText = fullAggName;
        if (hAxisTitle !== "") {
          titleText += " " + opts.localeStrings.vs + " " + hAxisTitle;
        }
        groupByTitle = pivotData.rowAttrs.join("-");
        if (groupByTitle !== "") {
          titleText += " " + opts.localeStrings.by + " " + groupByTitle;
        }
        title = $("<p>", {
          style: "text-align: center; font-weight: bold"
        });
        title.text(titleText);
        params = {
          axis: {
            y: {
              label: vAxisTitle
            },
            x: {
              label: hAxisTitle,
              tick: {
                rotate: rotationAngle,
                multiline: false
              }
            }
          },
          data: {
            type: chartOpts.type
          },
          tooltip: {
            grouped: false
          },
          color: {
            pattern: ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"]
          }
        };
        $.extend(params, opts.c3);
        if (chartOpts.type === "scatter") {
          params.data.x = hAxisTitle;
          params.axis.x.tick = {
            fit: false
          };
          params.data.json = dataArray;
          params.data.keys = {
            value: [hAxisTitle, vAxisTitle]
          };
          params.legend = {
            show: false
          };
          params.tooltip.format = {
            title: function() {
              return fullAggName;
            },
            name: function() {
              return "";
            },
            value: function(a, b, c, d) {
              return dataArray[d].tooltip;
            }
          };
        } else {
          params.axis.x.type = 'category';
          params.axis.x.categories = headers;
          params.data.columns = columns;
        }
        if (chartOpts.stacked != null) {
          params.data.groups = [
            (function() {
              var l, len3, results;
              results = [];
              for (l = 0, len3 = rowKeys.length; l < len3; l++) {
                x = rowKeys[l];
                results.push(x.join("-"));
              }
              return results;
            })()
          ];
        }
        renderArea = $("<div>", {
          style: "display:none;"
        }).appendTo($("body"));
        result = $("<div>").appendTo(renderArea);
        params.bindto = result[0];
        c3.generate(params);
        result.detach();
        renderArea.remove();
        $("<div>").append(title, result);
        return returnObject = {
          html: result
        };
      };
    };
    return c3_renderers = {
      "C3 - Line Chart": makeC3Chart(),
      "C3 - Bar Chart": makeC3Chart({
        type: "bar"
      }),
      "C3 - Stacked Bar Chart": makeC3Chart({
        type: "bar",
        stacked: true
      }),
      "C3 - Area Chart": makeC3Chart({
        type: "area",
        stacked: true
      }),
      "C3 - Scatter Chart": makeC3Chart({
        type: "scatter"
      })
    };
  });

}).call(this);

//# sourceMappingURL=c3_renderers.js.map
