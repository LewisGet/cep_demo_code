'use strict';
var $ = require('jquery');
var Backbone = require('backbone');
var PapereditListView = require('./views/paperedit_list_view');
var PapereditFormView = require('./views/paperedit_form_view');
var PapereditView = require('./views/paperedit_view');
var Paperedit = require('./models/paperedit');
var Paperedits = require('./collections/paperedits');
var render = require('./views/utils').render;

// Transcriptions collection for paperedit show
var Transcriptions = require('./collections/transcriptions');

/**
 * Render a string or view to the main container on the page
 * @param {(Object|String)} string_or_view A string or backbone view
 **/
function displayMain(string_or_view) {
  var content;
  if (typeof string_or_view === 'string') {
    content = string_or_view;
  } else {
    content = string_or_view.el;
    string_or_view.render();
  }
  $('#main').html(content);
}

/**
* Paperedits application router
*/
module.exports = Backbone.Router.extend({
  routes: {
    // '': 'index',
    'paperedits': 'papereditsList',
    'paperedits/new': 'newPaperedit',
    'paperedit/:id': 'showPaperedit',
    'paperedit/:id/edit': 'editPaperedit'
  },

  initialize: function() {
    console.debug('PAPEREDIT Router: INITIALIZED ROUTER');
    // Setup canonical paperedits collection
    this.papereditsList = new Paperedits();
  },

  // TODO: router not going to default page
  // index: function() {
  //   displayMain(render('welcome'));
  // },

  papereditsList: function() {
    var self = this;
    console.debug('Router: Paperedits list');
    if ( typeof this.papereditsListView === 'undefined' ) {
      this.papereditsListView = new PapereditListView({collection: this.papereditsList});
    }
    this.papereditsList.fetch({success: function() {
      displayMain(self.papereditsListView);
    }});
  },

  newPaperedit: function() {
    console.debug('Router: new paperedit');
    // creating a paperedit object, here could add default values such as
    // {title: "Video Interview "+getTimeNow(), description: getTimeNow()}
    var newPaperedit          = new Paperedit({title: '', description: ''});
    var newPapereditFormView  = new PapereditFormView({model: newPaperedit});
    // rendering in view
    displayMain(newPapereditFormView);
  },

  showPaperedit: function(cid) {
    var tmpPaperedit = this.papereditsList.get({'cid': cid});
    console.debug('Router: showPaperedit', cid, tmpPaperedit.attributes.title);
    this.transcriptionsList = new Transcriptions();

    this.transcriptionsList.fetch({success: function(collection, transciptions, errors) {
      console.debug("paperedit router",collection,collection.models, transciptions, errors);
      //using collection.toJSON(), becuase that way I get the models as attributes, and the colleciton is sorted. 
      //if I uses the  returned `transcriptions` they are not sorted.
      var tmpPapereditView = new PapereditView({model: tmpPaperedit, transciptions: collection.toJSON(), transcriptionCollection: collection.sort() });
      displayMain(tmpPapereditView);    
    }}); 
  },

  //TODO: not currently implements. eg nothing links to it.
  editPaperedit: function(id) {
    console.debug('Router: editPaperedit: ' + id);
    var tmpEditPaperedit = this.papereditsList.get({'cid': id});
    var editPapereditFormView = new PapereditFormView({model: tmpEditPaperedit});
    displayMain(editPapereditFormView);
  },


  notFound: function() {
    console.error('Not found');
    displayMain(render('404'));
    alert('Not found');
  }
});
