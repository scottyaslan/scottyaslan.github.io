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
define(['app', "gridster", "../../render/directives/renderingEngineDirective", '../../common/services/serviceProvider', '../../explore/services/exploreController'], function(app) {
    app.directive('explorationDirective', ['ServiceProvider', 'ExploreController',
        function(ServiceProvider, ExploreController) {
            return {
                restrict: 'E',
                templateUrl:'explore/views/explore.html',
                link: function(scope, element, attrs) {
                    ExploreController.init();
                    scope.ExploreController = ExploreController;
                    scope.ServiceProvider = ServiceProvider;
                }
            };
        }
    ]);
});