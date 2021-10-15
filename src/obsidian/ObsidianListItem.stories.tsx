import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import '/global.css';
import './ObsidianListItem.css'

import ObsidianListItem from './ObsidianListItem';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Obsidian/List Item',
  component: ObsidianListItem,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ObsidianListItem>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ObsidianListItem> = (args) => <div><ObsidianListItem {...args} /></div>;

export const Example = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Example.args = {
};
