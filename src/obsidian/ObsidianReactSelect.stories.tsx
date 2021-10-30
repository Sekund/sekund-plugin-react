import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import '/global.css';

import ObsidianReactSelect from './ObsidianReactSelect';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Obsidian / React Select',
    component: ObsidianReactSelect,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<any>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args) => <div><ObsidianReactSelect {...args} /></div>;

export const Example = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Example.args = {
};
