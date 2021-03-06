/*   Data Analytics Toolkit: Explore any data avaialable through a REST service 
*    Copyright (C) 2016  Scott Aslan
*
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU Affero General Public License as
*    published by the Free Software Foundation, either version 3 of the
*    License, or (at your option) any later version.
*
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU Affero General Public License for more details.
*
*    You should have received a copy of the GNU Affero General Public License
*    along with this program.  If not, see <http://www.gnu.org/licenses/agpl.html>.
*/
define([], function() {
    'use strict';

    function RenderingEngineManager(UiControls, ServiceProvider, RenderingEngineFactory, DataSourceConfigurationManager, DataSourceManager, DataSourceUtils, $http) {
        function RenderingEngineManager() {
            this.renderingEngines = {};
            this.activeRenderingEngine;
        }
        RenderingEngineManager.prototype = {
            constructor: RenderingEngineManager,
            init: function(){
                if(ServiceProvider.RenderingEngineManager === undefined){
                    ServiceProvider.add('RenderingEngineManager', renderingEngineManager);
                }
            },
            create: function(dataSourceConfigurationId) {
                if(DataSourceManager.dataSources[dataSourceConfigurationId] === undefined){
                    DataSourceManager.create(dataSourceConfigurationId, DataSourceConfigurationManager.dataSourceConfigurations[dataSourceConfigurationId].name);
                    $http(angular.fromJson(DataSourceConfigurationManager.dataSourceConfigurations[dataSourceConfigurationId].httpConfig)).then(function successCallback(response) {
                        // this callback will be called asynchronously
                        // when the response is available
                        DataSourceManager.dataSources[dataSourceConfigurationId].data = $.csv.toArrays(response.data);
                        DataSourceUtils.format(DataSourceManager.dataSources[dataSourceConfigurationId]);
                        UiControls.hideDialog();
                        var renderingEngine = new RenderingEngineFactory();
                        renderingEngine.init(dataSourceConfigurationId);
                        renderingEngine.active = true;  
                        renderingEngineManager.add(renderingEngine);
                        renderingEngineManager.activeRenderingEngine = renderingEngine.id;
                    }, function errorCallback(response) {
                        var tmp;
                        DataSourceManager.delete(dataSourceConfigurationId);
                    });
                } else{
                    UiControls.hideDialog();
                    var renderingEngine = new RenderingEngineFactory();
                    renderingEngine.init(dataSourceConfigurationId);
                    renderingEngineManager.add(renderingEngine);
                    renderingEngineManager.activeRenderingEngine = renderingEngine.id;
                }
            },
            add: function(renderingEngine){
                renderingEngineManager.renderingEngines[renderingEngine.id] = renderingEngine;
            },
            delete: function(id){
                delete renderingEngineManager.renderingEngines[id];
            },
            setActiveRenderingEngine: function(id){
                renderingEngineManager.activeRenderingEngine = id;
                angular.forEach(renderingEngineManager.renderingEngines, function(RenderingEngine) {
                    RenderingEngine.active = false;
                    if(RenderingEngine.id === id){
                        RenderingEngine.active = true;
                    }
                });
            },
            updateAllRenderingEngineTileSizeAndPosition: function($widgets){
                angular.forEach($widgets, function($widget){
                    renderingEngineManager.renderingEngines[$widget.id].updateTile($($widget).attr('data-sizex'), $($widget).attr('data-sizey'), $($widget).attr('data-col'), $($widget).attr('data-row'))
                });
            }
        };
        var renderingEngineManager = new RenderingEngineManager();
        renderingEngineManager.init();
        return renderingEngineManager;
    }

    RenderingEngineManager.$inject=['UiControls', 'ServiceProvider', 'RenderingEngineFactory', 'DataSourceConfigurationManager', 'DataSourceManager', 'DataSourceUtils', '$http'];

    return RenderingEngineManager;
});