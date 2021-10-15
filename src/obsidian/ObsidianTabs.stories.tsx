import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import '/global.css';

import ObsidianTabs from './ObsidianTabs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Obsidian/Tabs',
  component: ObsidianTabs,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ObsidianTabs>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ObsidianTabs> = (args) => <div><ObsidianTabs {...args} /></div>;

export const Example = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Example.args = {
};
