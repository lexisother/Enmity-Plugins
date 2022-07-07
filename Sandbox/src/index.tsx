import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { getByProps } from 'enmity/metro';
import { makeStore } from 'enmity/api/settings';
import { create } from 'enmity/patcher';
import { React } from 'enmity/metro/common';
import manifest from '../manifest.json';

import Settings from './components/Settings';

const FluxDispatcher = getByProps('_currentDispatchActionType', '_subscriptions', '_waitQueue');
const Patcher = create('sandbox');

const SilentTyping: Plugin = {
   ...manifest,

   onStart() {
    const Settings = makeStore(this.name);
    Patcher.after(FluxDispatcher, 'dispatch', (_, ...args) => {
      if (Settings.get('sandboxLogAll', false)) {
        console.log(args[0]);
      }
    });
   },

   onStop() {
      Patcher.unpatchAll();
   },

   getSettingsPanel({ settings }) {
      return <Settings settings={settings} />;
   }
};

registerPlugin(SilentTyping);
