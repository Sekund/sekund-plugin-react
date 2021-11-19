import { People } from "@/domain/People";
import { someone } from "@/mockdata/PeoplesMock";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import SekundPeopleSummary from './SekundPeopleSummary';
import '/global.css';

export default {
  title: 'Sekund/People Summary',
  component: SekundPeopleSummary,
} as ComponentMeta<typeof SekundPeopleSummary>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args, { globals: { locale } }) => {

  return <div className="sekund">
    <SekundPeopleSummary {...args} displayShared={() => { }} displaySharing={() => { }} />
  </div>
};

export const Someone = Template.bind({});
Someone.args = {
  people: someone
};

export const WithUnreadSharedNotes = Template.bind({});
WithUnreadSharedNotes.args = {
  people: { ...someone, unreadShared: 200 } as People
};
