import { Group } from "@/domain/Group";
import { People } from "@/domain/People";
import React from "react";
import Avatar from "react-avatar";

export function getAvatar(name: string | undefined, image: string | undefined, email: string | undefined, size: number) {
  if (image) {
    return avatarImage(image, size);
  } else if (email) {
    return emailAvatar(email, name, size);
  } else if (name) {
    return nameAvatar(name, size);
  }
  return null;
}

export function groupAvatar(group: Group, size = 6) {
  return nameAvatar(group.name, size);
}

export function nameAvatar(name: string, size = 6) {
  return <Avatar className="flex-shrink-0" name={name} size={`${size * 0.25}rem`} round={true}></Avatar>;
}

export function emailAvatar(email: string, name: string | undefined, size = 6) {
  return <Avatar className="flex-shrink-0" name={name ? name : undefined} email={email} size={`${size * 0.25}rem`} round={true}></Avatar>;
}

export function peopleAvatar(people: People, size = 6) {
  if (people.image) return avatarImage(people.image, size);
  else if (people.email) return emailAvatar(people.email, people.name, size);
  else if (people.name) return nameAvatar(people.name, size);
  return null;
}

export function avatarImage(image: string, size = 6) {
  return <Avatar src={image} size={`${size * 0.25}rem`} round={true}></Avatar>;
}
