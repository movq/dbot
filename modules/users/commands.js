var _ = require('underscore')._;

var commands = function(dbot) {
    var commands = {
        '~alias': function(event) {
            var knownUsers = this.getServerUsers(event.server),
                alias = event.params[1].trim();

            if(_.include(knownUsers.users, alias)) {
                var aliasCount = _.reduce(knownUsers.aliases, function(memo, user) {
                    if(user == alias) return memo += 1; 
                }, 0, this);

                event.reply(dbot.t('primary', { 
                    'user': alias, 
                    'count': aliasCount 
                })); 
            } else if(_.has(knownUsers.aliases, alias)) {
                event.reply(dbot.t('alias', { 
                    'alias': alias, 
                    'user': knownUsers.aliases[alias] 
                }));
            } else {
                event.reply(dbot.t('unknown_alias', { 'alias': alias }));
            }
        },

        '~setaliasparent': function(event) {
            var knownUsers = this.getServerUsers(event.server);
            var newParent = event.params[1];

            if(_.has(knownUsers.aliases, newParent)) {
                var newAlias = knownUsers.aliases[newParent]; 

                // Replace user entry
                knownUsers.users = _.without(knownUsers.users, newAlias);
                knownUsers.users.push(newParent);

                // Replace channels entries with new primary user
                this.updateChannels(event, newAlias, newParent);

                // Remove alias for new parent & add alias for new alias
                delete knownUsers.aliases[newParent];
                knownUsers.aliases[newAlias] = newParent;

                // Update aliases to point to new primary user
                this.updateAliases(event, newAlias, newParent);

                event.reply(dbot.t('aliasparentset', { 
                    'newParent': newParent, 
                    'newAlias': newAlias 
                }));

                dbot.api.stats.fixStats(event.server, newAlias);
            } else {
                event.reply(dbot.t('unknown_alias', { 'alias': newParent }));
            }
        },

        '~mergeusers': function(event) {
            var knownUsers = this.getServerUsers(event.server);
            var primaryUser = event.params[1];
            var secondaryUser = event.params[2];

            if(_.include(knownUsers.users, primaryUser) && _.include(knownUsers.users, secondaryUser)) {
                knownUsers.users = _.without(knownUsers.users, secondaryUser);
                knownUsers.aliases[secondaryUser] = primaryUser;
                this.updateAliases(event, secondaryUser, primaryUser);
                this.updateChannels(event, secondaryUser, primaryUser);

                event.reply(dbot.t('merged_users', { 
                    'old_user': secondaryUser,
                    'new_user': primaryUser
                }));
                
                dbot.api.stats.fixStats(event.server, secondaryUser);
            } else {
                event.reply(dbot.t('unprimary_error'));
            }
        } 
    };

    commands['~setaliasparent'].access = 'moderator';
    commands['~mergeusers'].access = 'moderator';
    
    return commands;
};

exports.fetch = function(dbot) {
    return commands(dbot);
};
