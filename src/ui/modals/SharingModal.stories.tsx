import { Group } from "@/domain/Group";
import SharingModal from "@/ui/modals/SharingModal";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import ObjectID from "bson-objectid";
import React from "react";
import "/global.css";
import { someNote } from "@/mockdata/NotesMock";
import { People } from "@/domain/People";

export default {
  title: "Sekund/Sharing Modal",
  component: SharingModal,
} as ComponentMeta<typeof SharingModal>;

const peoples = [
  { _id: new ObjectID(), name: "Thibault de Malempré", image: "https://joeschmoe.io/api/v1/a" },
  { _id: new ObjectID(), name: "Mephistophniel Nathanielflame", image: "https://joeschmoe.io/api/v1/b" },
  { _id: new ObjectID(), name: "Bobspencer Griffinmoondancer", image: "https://joeschmoe.io/api/v1/c" },
  { _id: new ObjectID(), name: "Mediri Nicholswalker", image: "https://joeschmoe.io/api/v1/d" },
  { _id: new ObjectID(), name: "Chewturca The Medinatt", image: "https://joeschmoe.io/api/v1/e" },
  { _id: new ObjectID(), name: "Bobanderson Mormoondancer", image: "https://joeschmoe.io/api/v1/f" },
  { _id: new ObjectID(), name: "Gorilbo Youngaggins Forestjohnston", image: "https://joeschmoe.io/api/v1/g" },
  { _id: new ObjectID(), name: "Wrightgobble", image: "https://joeschmoe.io/api/v1/h" },
] as Array<People>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args, { globals: { locale } }) => {
  return (
    <div className="sekund">
      <SharingModal userId={new ObjectID()} open={true} setOpen={() => {}} note={{ ...someNote, sharing: { peoples } }} />
    </div>
  );
};

export const Example = Template.bind({});
