
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
      return pivotModule(require("jquery"));
    } else if (typeof define === "function" && define.amd) {
      return define(["jquery"], pivotModule);
    } else {
      return pivotModule(jQuery);
    }
  };

  callWithJQuery(function($) {
    var gchart_renderers, makeGoogleChart;
    makeGoogleChart = function(chartType, extraOptions) {
      return function(pivotData, opts) {
        var agg, base, base1, colKey, colKeys, dataArray, dataTable, defaults, fullAggName, groupByTitle, h, hAxisTitle, headers, i, j, len, len1, numCharsInHAxis, options, ref, result, returnObject, row, rowKey, rowKeys, title, tree2, vAxisTitle, val, wrapper, x, y;
        defaults = {
          localeStrings: {
            vs: "vs",
            by: "by"
          },
          gchart: {}
        };
        opts = $.extend(true, defaults, opts);
        if ((base = opts.gchart).width == null) {
          base.width = window.innerWidth / 1.4;
        }
        if ((base1 = opts.gchart).height == null) {
          base1.height = window.innerHeight / 1.4;
        }
        rowKeys = pivotData.getRowKeys();
        if (rowKeys.length === 0) {
          rowKeys.push([]);
        }
        colKeys = pivotData.getColKeys();
        if (colKeys.length === 0) {
          colKeys.push([]);
        }
        fullAggName = pivotData.aggregatorName;
        if (pivotData.valAttrs.length) {
          fullAggName += "(" + (pivotData.valAttrs.join(", ")) + ")";
        }
        headers = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = rowKeys.length; i < len; i++) {
            h = rowKeys[i];
            results.push(h.join("-"));
          }
          return results;
        })();
        headers.unshift("");
        numCharsInHAxis = 0;
        if (chartType === "ScatterChart") {
          dataArray = [];
          ref = pivotData.tree;
          for (y in ref) {
            tree2 = ref[y];
            for (x in tree2) {
              agg = tree2[x];
              dataArray.push([parseFloat(x), parseFloat(y), fullAggName + ": \n" + agg.format(agg.value())]);
            }
          }
          dataTable = new google.visualization.DataTable();
          dataTable.addColumn('number', pivotData.colAttrs.join("-"));
          dataTable.addColumn('number', pivotData.rowAttrs.join("-"));
          dataTable.addColumn({
            type: "string",
            role: "tooltip"
          });
          dataTable.addRows(dataArray);
          hAxisTitle = pivotData.colAttrs.join("-");
          vAxisTitle = pivotData.rowAttrs.join("-");
          title = "";
        } else {
          dataArray = [headers];
          for (i = 0, len = colKeys.length; i < len; i++) {
            colKey = colKeys[i];
            row = [colKey.join("-")];
            numCharsInHAxis += row[0].length;
            for (j = 0, len1 = rowKeys.length; j < len1; j++) {
              rowKey = rowKeys[j];
              agg = pivotData.getAggregator(rowKey, colKey);
              if (agg.value() != null) {
                val = agg.value();
                if ($.isNumeric(val)) {
                  if (val < 1) {
                    row.push(parseFloat(val.toPrecision(3)));
                  } else {
                    row.push(parseFloat(val.toFixed(3)));
                  }
                } else {
                  row.push(val);
                }
              } else {
                row.push(null);
              }
            }
            dataArray.push(row);
          }
          dataTable = google.visualization.arrayToDataTable(dataArray);
          title = vAxisTitle = fullAggName;
          hAxisTitle = pivotData.colAttrs.join("-");
          if (hAxisTitle !== "") {
            title += " " + opts.localeStrings.vs + " " + hAxisTitle;
          }
          groupByTitle = pivotData.rowAttrs.join("-");
          if (groupByTitle !== "") {
            title += " " + opts.localeStrings.by + " " + groupByTitle;
          }
        }
        options = {
          title: title,
          hAxis: {
            title: hAxisTitle,
            slantedText: numCharsInHAxis > 50
          },
          vAxis: {
            title: vAxisTitle
          },
          tooltip: {
            textStyle: {
              fontName: 'Arial',
              fontSize: 12
            }
          },
          chartArea: {
            'width': '80%',
            'height': '80%'
          }
        };
        if (chartType === "ColumnChart") {
          options.vAxis.minValue = 0;
        }
        if (chartType === "ScatterChart") {
          options.legend = {
            position: "none"
          };
        } else if (dataArray[0].length === 2 && dataArray[0][1] === "") {
          options.legend = {
            position: "none"
          };
        }
        $.extend(options, opts.gchart, extraOptions);
        result = $("<div>").css({
          width: opts.gchart.width,
          height: opts.gchart.height
        });
        wrapper = new google.visualization.ChartWrapper({
          dataTable: dataTable,
          chartType: chartType,
          options: options
        });
        wrapper.draw(result[0]);
        result.bind("dblclick", function() {
          var editor;
          editor = new google.visualization.ChartEditor();
          google.visualization.events.addListener(editor, 'ok', function() {
            return editor.getChartWrapper().draw(result[0]);
          });
          return editor.openDialog(wrapper);
        });
        return returnObject = {
          html: result
        };
      };
    };
    return gchart_renderers = {
      "Line Chart": makeGoogleChart("LineChart"),
      "Bar Chart": makeGoogleChart("ColumnChart"),
      "Stacked Bar Chart": makeGoogleChart("ColumnChart", {
        isStacked: true
      }),
      "Area Chart": makeGoogleChart("AreaChart", {
        isStacked: true
      }),
      "Scatter Chart": makeGoogleChart("ScatterChart")
    };
  });

}).call(this);

//# sourceMappingURL=gchart_renderers.js.map
