'use strict';
(function($){
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };
    Backbone.Model.prototype.idAttribute = '_id';
    var tweetsView, tweetDetailsView;    
    var Tweet = Backbone.Model.extend({
        urlRoot: '/tweets',
        defaults: function(){
            return {
                author: "",
                status: ""
            }
        }
    });
    var TweetsList = Backbone.Collection.extend({
        model: Tweet,
        url: '/tweets'
    });
    var tweets = new TweetsList();
    var TweetView = Backbone.View.extend({
        model: new Tweet(),
        tagName: 'div', //each tweet will create a div
        initialize: function(){
            this.template = _.template($('#tweet-template').html());
        },
        events: {
            'click .edit': 'edit',
            'click .delete': 'delete',
            'click .details': 'details',
            'blur .status': 'close',
            'keypress .status': 'onEnterUpdate'
        },
        edit: function(ev){                    
            ev.preventDefault();
            this.$('.status').attr('contenteditable', true).focus();
        },
        details: function(ev){  
            var target = $(ev.currentTarget);    
            ev.preventDefault();
            router.navigate(target.attr('href'), {trigger: true});        
        },
        delete: function(ev){
            ev.preventDefault();
            var self = this;
            this.model.destroy({
                success: function(){ tweets.remove(self.model); },
                error: function(){ console.log('Failed to remove tweet ' + self.model.id); }
            });            
        },
        close: function(ev){
            var self = this;
            var status = this.$('.status').text();
            this.model.set('status', status);            
            this.model.save({}, {
                success: function(){ console.log('successfully updated tweet ' + self.model.id); },
                error: function(){ console.log('error updating tweet ' + self.model.id); }
            });
            this.$('.status').removeAttr('contenteditable');
        },
        onEnterUpdate: function(ev){
            if(ev.keycode === "13"){
                var self = this;
                this.close();
                _.delay(function(){
                    self.$('.status').blur()
                }, 100);
            }                    
        },
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
    var TweetsView  = Backbone.View.extend({
        model: tweets,
        el: $('#tweets-container'),
        initialize: function(){
            var self = this;
            this.model.on('add', this.render, this);
            this.model.on('remove', this.render, this);

            tweets.fetch({
                success: function(){ self.render(); },
                error: function(){ console.log('nothing to fetch'); }
            });
        },
        render: function(){
            var self = this;
            self.$el.html('');
            _.each(this.model.toArray(), function(tweet, i){
                self.$el.append((new TweetView({model: tweet})).render().$el);
            });
            return this;
        },
        hide: function(){
            this.$el.hide();
        },
        show: function(){
            this.$el.show();
        }                
    });

    var TweetDetailsView = Backbone.View.extend({
        el: $('#tweet-details'),
        events: {
            'click .back': 'back'
        },
        initialize: function(){
            this.template = _.template($('#tweet-details-template').html());            
        },
        back: function(ev){
            ev.preventDefault();
            router.navigate('', {trigger: true});
        },
        hide: function(){
            this.$el.hide();
        },
        show: function(model){
            this.model = model;
            this.render();
            this.$el.show();
        },
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;            
        }
    });

    var Router = Backbone.Router.extend({
        routes: {
           '' : 'index',
           'tweets/:id': 'show'
        },
        index: function(){
            tweetDetailsView.hide();
            tweetsView.show();
        },
        show: function(id, model){
            model= new Tweet({_id: id});
            model.fetch({
                success: function(){ 
                    tweetDetailsView.show(model);
                    tweetsView.hide();
                },
                error: function(){ console.log('cannot fetch model to show'); }
            });          
        }
    });

    var router = new Router();

    $(document).ready(function(){
        $('#new-tweet').on('submit', function(){
            var tweet = new Tweet({author: $('#author').val(), status: $('#status').val()});
            tweets.add(tweet);
            console.log(tweets.toJSON());
            tweet.save({}, {
                success: function(){ console.log('yay'); },
                error: function(){ console.log('nay'); }
            });
            return false;
        });

        tweetsView = new TweetsView();
        tweetDetailsView = new TweetDetailsView();
        Backbone.history.start({pushState: true});
    });
})(jQuery);
//
//var tweets = new TweetsList([tweet1, tweet2, tweet3]);
//console.log(tweets.first(2));
//console.log(tweets.toJSON()); //not json need to call json.stringafy