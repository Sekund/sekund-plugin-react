import AppStateWrapper from '@/storybook/AppStateWrapper';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import SekundNoteComponent from './SekundNoteComponent';
import '/global.css';

export default {
    title: 'Note',
    component: SekundNoteComponent,
} as ComponentMeta<typeof SekundNoteComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
    const wrapper = new AppStateWrapper(args.gState, args.nState, locale)
    return <SekundNoteComponent view={wrapper} />
};

// export type NoteState = {
//     published: boolean; // exists in Sekund
//     fileSynced: boolean; // exists and synched
//     publishing: boolean;
//     comparing: boolean;
//   };

export const Unpublished = Template.bind({});
Unpublished.args = {
    gState: "allGood",
    nState: { published: false }
};

export const Published = Template.bind({});
Published.args = {
    gState: "allGood",
    nState: { published: true, fileSynced: true }
};

export const Error = Template.bind({});
Error.args = {
    gState: "unknownError"
};
