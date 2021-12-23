import { Group } from "@/domain/Group";
import GroupModal from "@/ui/groups/GroupModal";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import ObjectID from "bson-objectid";
import React from "react";
import "/global.css";

export default {
  title: "Sekund/Group Modal",
  component: GroupModal,
} as ComponentMeta<typeof GroupModal>;

const group = {
  _id: new ObjectID(),
  name: "Pads lovers",
  created: Date.now(),
  updated: Date.now(),
  peoples: [
    { _id: new ObjectID(), name: "Thibault de Malempré", image: "https://joeschmoe.io/api/v1/a" },
    { _id: new ObjectID(), name: "Mephistophniel Nathanielflame", image: "https://joeschmoe.io/api/v1/b" },
    { _id: new ObjectID(), name: "Bobspencer Griffinmoondancer", image: "https://joeschmoe.io/api/v1/c" },
    { _id: new ObjectID(), name: "Mediri Nicholswalker", image: "https://joeschmoe.io/api/v1/d" },
    { _id: new ObjectID(), name: "Chewturca The Medinatt", image: "https://joeschmoe.io/api/v1/e" },
    { _id: new ObjectID(), name: "Bobanderson Mormoondancer", image: "https://joeschmoe.io/api/v1/f" },
    { _id: new ObjectID(), name: "Gorilbo Youngaggins Forestjohnston", image: "https://joeschmoe.io/api/v1/g" },
    { _id: new ObjectID(), name: "Wrightgobble", image: "https://joeschmoe.io/api/v1/h" },
  ],
  userId: new ObjectID("6150c1ef14be465c39539ccf"),
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
  return (
    <div className="sekund">
      <GroupModal userId={new ObjectID()} open={true} setOpen={() => {}} group={group as Group} />
    </div>
  );
};

export const Example = Template.bind({});
