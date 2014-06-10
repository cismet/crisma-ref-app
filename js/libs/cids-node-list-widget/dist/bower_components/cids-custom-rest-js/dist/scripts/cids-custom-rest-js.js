angular.module('de.cismet.cids.rest.collidngNames.Nodes', ['ngResource']).factory('de.cismet.collidingNameService.Nodes', [
  '$resource',
  'CRISMA_ICMM_API',
  'CRISMA_DOMAIN',
  function ($resource, CRISMA_ICMM_API, CRISMA_DOMAIN) {
    'use strict';
    var transformResult, transformSingleResult, Nodes, utils;
    transformSingleResult = function (node) {
      var that, getChildrenFunc;
      getChildrenFunc = function (callback) {
        var children;
        that = this;
        children = Nodes.children({ nodeId: that.key }, callback);
        return children.$promise;
      };
      // we augment the node object of the rest api with a method how the children are generated
      node.icon = 'fa fa-globe';
      //              currNode.leaf = true;
      node.getChildren = getChildrenFunc;
      node.link = node.objectKey;
      node.icon = !node.leaf ? 'fa fa-folder-o' : 'fa fa-globe';
      node.isLeaf = node.leaf;
      return node;
    };
    transformResult = function (data) {
      var nodes = JSON.parse(data).$collection, i, currNode;
      var wsNodes = [];
      for (i = 0; i < nodes.length; ++i) {
        if (nodes[i].key !== '-1') {
          currNode = nodes[i];
          wsNodes.push(transformSingleResult(currNode));
        }
      }
      return wsNodes;
    };
    Nodes = $resource(CRISMA_ICMM_API + '/nodes', {
      nodeId: '@id',
      domain: CRISMA_DOMAIN
    }, {
      get: {
        method: 'GET',
        params: { deduplicate: true },
        url: CRISMA_ICMM_API + '/nodes/' + CRISMA_DOMAIN + '.:nodeId',
        transformResponse: function (data) {
          if (!data) {
            return null;
          }
          var node = JSON.parse(data);
          return transformSingleResult(node);
        }
      },
      query: {
        method: 'GET',
        isArray: true,
        transformResponse: function (data) {
          return transformResult(data);
        }
      },
      children: {
        method: 'GET',
        isArray: true,
        params: { level: 2 },
        url: CRISMA_ICMM_API + '/nodes/' + CRISMA_DOMAIN + '.:nodeId' + '/children',
        transformResponse: function (data) {
          return transformResult(data);
        }
      },
      scenarios: {
        method: 'GET',
        isArray: true,
        params: { deduplicate: true },
        url: CRISMA_ICMM_API + '/nodes/' + CRISMA_DOMAIN + '.-1' + '/children',
        transformResponse: function (data) {
          return transformResult(data);
        }
      }
    });
    utils = {
      getRequestIdForWorldstate: function (worldstate) {
        var parent = worldstate.parentworldstate, nodeKey = [worldstate.id];
        while (parent.parentworldstate) {
          nodeKey.push(parent.id);
          parent = parent.parentworldstate;
        }
        nodeKey.push(parent.id);
        return nodeKey.reverse().join('.');
      },
      getRequestIdForNodeKey: function (nodeKey) {
        return nodeKey;
      }
    };
    Nodes.utils = utils;
    return Nodes;
  }
]);