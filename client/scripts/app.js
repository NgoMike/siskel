var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    // access the current value of like, and set it to opposite of current val
    this.set('like', !this.get('like'));
    // this.collection.sort();
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    //listen for any change, if there is a change, sort
    this.on('change', this.sort, this);
  },

  comparator: 'title',

  sortByField: function(field) {
    //access current comparator, change it to the argument
    this['comparator'] = field; // no change is occuring
    this.sort(); // does this make a change event?
  }
  
  // this.model.on('change: toggleLike', this.sort(), this);

});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    // console.log("field toggle was clicked")
    var field = $(e.target).val();
    this.collection.sortByField(field);
    
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    //listen for a change in toggleLike, re-render on change
    this.model.on('change', this.render, this);

    // this.listenTo(this.model, 'change: toggleLike', this.render);
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    //should toggleLike when handleClick is called
    this.model.toggleLike();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    //should re-render when there is a change
    this.collection.on('sort', this.render, this);
  },

  render: function() {
// debugger;
   console.log("render was called")
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
