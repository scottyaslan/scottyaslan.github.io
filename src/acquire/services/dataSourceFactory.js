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

    function DataSourceFactory() {
        function DataSourceFactory(dataSourceConfigId, name) {
            this.dataSourceConfigId = dataSourceConfigId;
            this.data;
            this.name = name;
            this.formattedData;
        }
        DataSourceFactory.prototype = {
            constructor: DataSourceFactory
        };
        return DataSourceFactory;
    }

    DataSourceFactory.$inject=[];

    return DataSourceFactory;
});