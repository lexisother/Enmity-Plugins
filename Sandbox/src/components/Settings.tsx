import { FormRow, FormSwitch, ScrollView } from 'enmity/components';
import { SettingsStore } from 'enmity/api/settings';
import { React } from 'enmity/metro/common';

interface SettingsProps {
  settings: SettingsStore;
}

export default ({ settings }: SettingsProps) => {
  return (
    <ScrollView>
      <FormRow
        label="Log all FluxDispatcher emits"
        trailing={
          <FormSwitch
            value={settings.get('sandboxLogAll', false)}
            onValueChange={() => settings.toggle('sandboxLogAll', false)}
          />
        }
      />
    </ScrollView>
  );
};
