import { Group } from "@/domain/Group";
import { PeopleId } from "@/domain/People";
import { Avatar, BadgeUnstyled } from "@mui/material";
import { styled } from "@mui/material/styles";
import ObjectID from "bson-objectid";
import React from "react";

const StyledBadge = styled(BadgeUnstyled)`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.85);
  font-size: 8px;
  font-variant: tabular-nums;
  list-style: none;
  font-feature-settings: "tnum";
  position: relative;
  display: inline-block;
  line-height: 1;

  & .MuiBadge-badge {
    z-index: auto;
    min-width: 10px;
    height: 11px;
    padding: 0 2px;
    color: #fff;
    font-weight: 400;
    font-size: 10px;
    line-height: 10px;
    white-space: nowrap;
    text-align: center;
    background: #dc707c;
    border-radius: 10px;
    box-shadow: 0 0 0 1px #fff;
  }

  & .MuiBadge-dot {
    padding: 0;
    z-index: auto;
    min-width: 6px;
    width: 6px;
    height: 6px;
    background: #dc707c;
    border-radius: 100%;
    box-shadow: 0 0 0 1px #fff;
  }

  & .MuiBadge-anchorOriginTopRightCircular {
    position: absolute;
    top: 5px;
    right: 0;
    transform: translate(50%, -50%);
    transform-origin: 100% 0;
  }
`;

export function peopleAvatar(people: PeopleId, size: number, badge?: number) {
  if (people.image) return avatarImage(people.image, people._id, size, badge);
  else if (people.email) return emailAvatar(people.email, people._id, size, badge);
  else if (people.name) return nameAvatar(people.name, people._id, size, badge);
  return null;
}

export function groupAvatar(group: Group, size: number, badge?: number) {
  if (!group || !group._id) {
    return null;
  }
  if (badge) {
    return (
      <StyledBadge key={group._id.toString()} badgeContent={badge}>
        <Avatar className={`h-${size} w-${size} flex-shrink-0 bg-gray-800`} variant="rounded" alt={group.name}>
          {getInitials(group.name)}
        </Avatar>
      </StyledBadge>
    );
  }
  return (
    <Avatar key={group._id.toString()} className={`h-${size} w-${size} flex-shrink-0 bg-gray-800`} variant="rounded" alt={group.name}>
      {getInitials(group.name)}
    </Avatar>
  );
}

export function nameAvatar(name: string, id: ObjectID, size: number, badge?: number) {
  if (badge) {
    return (
      <StyledBadge key={id.toString()} badgeContent={badge} overlap="circular">
        <Avatar className={`h-${size} w-${size} flex-shrink-0`} alt={name}>
          {getInitials(name)}
        </Avatar>
      </StyledBadge>
    );
  }
  return (
    <Avatar key={id.toString()} className={`h-${size} w-${size} flex-shrink-0`} alt={name}>
      {getInitials(name)}
    </Avatar>
  );
}

export function emailAvatar(email: string, id: ObjectID, size: number, badge?: number) {
  if (badge) {
    return (
      <StyledBadge key={id.toString()} badgeContent={badge} overlap="circular">
        <Avatar className={`h-${size} w-${size} flex-shrink-0`}>{getInitials(email)}</Avatar>
      </StyledBadge>
    );
  }
  return (
    <Avatar key={id.toString()} className={`h-${size} w-${size} flex-shrink-0`}>
      {getInitials(email)}
    </Avatar>
  );
}

export function avatarImage(image: string, id: ObjectID, size: number, badge?: number) {
  if (badge) {
    return (
      <StyledBadge key={id.toString()} badgeContent={badge} overlap="circular">
        <Avatar src={image} className={`h-${size} w-${size} rounded-full`}></Avatar>
      </StyledBadge>
    );
  }
  return <Avatar key={id.toString()} src={image} className={`h-${size} w-${size} rounded-full`}></Avatar>;
}

export function getInitials(fullName: string): string {
  const allNames = fullName.trim().split(" ");
  const initials = allNames.reduce((acc, curr, index) => {
    if (index === 0 || index === allNames.length - 1) {
      // eslint-disable-next-line no-param-reassign
      acc = `${acc}${curr.charAt(0).toUpperCase()}`;
    }
    return acc;
  }, "");
  return initials.replace(/[^\p{L}|\p{N}]+/u, "");
}
