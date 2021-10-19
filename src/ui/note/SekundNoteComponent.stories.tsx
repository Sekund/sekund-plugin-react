import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import SekundNoteComponent from './SekundNoteComponent';
import '/global.css';

export default {
    title: 'Note',
    component: SekundNoteComponent,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof SekundNoteComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
    return <SekundNoteComponent {...args} />
};

export const Empty = Template.bind({});
Empty.args = {
    gState: "connecting"
};
