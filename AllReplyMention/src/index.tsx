import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { getByProps } from 'enmity/metro';
import { makeStore } from 'enmity/api/settings';
import { create } from 'enmity/patcher';
import { getIDByName } from 'enmity/api/assets';
import { React, Toasts } from 'enmity/metro/common';
import manifest from '../manifest.json';

import { constructMessage } from './lib/common';
import Settings from './components/Settings';

const FluxDispatcher = getByProps('_currentDispatchActionType', '_subscriptions', '_waitQueue');
const Patcher = create('allreplymention');

// Common-use functions
const { getCurrentUser } = getByProps('getCurrentUser');

const SilentTyping: Plugin = {
  ...manifest,

  onStart() {
    const Settings = makeStore(this.name);

    // Make sure the MESSAGE_CREATE action handler is available
    FluxDispatcher.dispatch({
      type: 'MESSAGE_CREATE',
      message: constructMessage('PLACEHOLDER', { id: '0' }),
    });

    const MessageCreate = FluxDispatcher._orderedActionHandlers.MESSAGE_CREATE.find(
      (h) => h.name === 'MessageStore',
    );
    Patcher.before(MessageCreate, 'actionHandler', (_, args) => {
      const clientUser = getCurrentUser();
      const message = args[0].message;
      if (message.referenced_message) {
        if (message.referenced_message.author.id !== clientUser.id) {
          console.log("Received message was not a reply to client user, skipping.")
          return;
        }
        if (message.mentions.length !== 0) {
          console.log("Received message had a ping, skipping.")
          return
        }
        console.log("Received message was a reply to current user and had no ping, criteria satisfied!")
        Settings.set('messageStore', [message, ...Settings.get('messageStore', [])]);
        Toasts.open({
          content: `${message.author.username} replied to you!`,
          source: getIDByName('ic_info')
        })
      }
    });

    // Once again, trigger the action handlers so we can use them
    FluxDispatcher.dispatch({ type: 'LOAD_RECENT_MENTIONS', guildId: null });
    FluxDispatcher.dispatch({ type: 'LOAD_RECENT_MENTIONS_SUCCESS', messages: [] });
    const LoadRecentMentionsSuccess = FluxDispatcher._orderedActionHandlers.LOAD_RECENT_MENTIONS_SUCCESS.find(
      h => h.name === 'RecentMentionsStore'
    )
    Patcher.before(LoadRecentMentionsSuccess, 'actionHandler', (_, args) => {
      let messages = args[0].messages;
      messages = [...Settings.get('messageStore', []), ...messages];
      args[0].messages = messages;
      args[0].messages = args[0].messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    });
  },

  onStop() {
    Patcher.unpatchAll();
  },

  getSettingsPanel({ settings }) {
    return <Settings settings={settings} />;
  },
};

registerPlugin(SilentTyping);
