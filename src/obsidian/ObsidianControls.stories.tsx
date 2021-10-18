import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import '/global.css';

import ObsidianControls from './ObsidianControls';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Obsidian/ Controls',
    component: ObsidianControls,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof ObsidianControls>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ObsidianControls> = (args) => <div><ObsidianControls {...args} /></div>;

export const Example = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Example.args = {
};
