import { Group } from "@/domain/Group";
import { People } from "@/domain/People";
import { Avatar, BadgeUnstyled, Box } from "@mui/material";
import { styled } from '@mui/material/styles';
import React from "react";

const StyledBadge = styled(BadgeUnstyled)`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.85);
  font-size: 8px;
  font-variant: tabular-nums;
  list-style: none;
  font-feature-settings: 'tnum';
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

function BadgeContent() {
  return (
    <Box
      component="span"
      sx={{
        width: 42,
        height: 42,
        borderRadius: '2px',
        background: '#eee',
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
    />
  );
}

export function getAvatar(name: string | undefined, image: string | undefined, email: string | undefined, size: number, badge?: number) {
  if (image) {
    return avatarImage(image, size, badge);
  } else if (email) {
    return emailAvatar(email, size, badge);
  } else if (name) {
    return nameAvatar(name, size, badge);
  }
  return null;
}

export function groupAvatar(group: Group, size: number, badge?: number) {
  return nameAvatar(group.name, size, badge);
}

export function nameAvatar(name: string, size: number, badge?: number) {
  return <Avatar className={`h-${size} w-${size} flex-shrink-0`} alt={name}>
    {getInitials(name)}
  </Avatar>
}

export function emailAvatar(email: string, size: number, badge?: number) {
  return <Avatar className={`h-${size} w-${size} flex-shrink-0`}>
    {getInitials(email)}
  </Avatar>
}

export function peopleAvatar(people: People, size: number, badge?: number) {
  if (people.image) return avatarImage(people.image, size, badge);
  else if (people.email) return emailAvatar(people.email, size, badge);
  else if (people.name) return nameAvatar(people.name, size, badge);
  return null;
}

export function avatarImage(image: string, size: number, badge?: number) {
  if (badge) {
    return <StyledBadge
      badgeContent={2}
      overlap="circular"
    >
      <Avatar src={image} className={`h-${size} w-${size} rounded-full`}></Avatar>
    </StyledBadge>
  }
  return (<Avatar src={image} className={`h-${size} w-${size} rounded-full`}></Avatar>)
}

export function getInitials(fullName: string): string {
  const allNames = fullName.trim().split(' ');
  const initials = allNames.reduce((acc, curr, index) => {
    if (index === 0 || index === allNames.length - 1) {
      // eslint-disable-next-line no-param-reassign
      acc = `${acc}${curr.charAt(0).toUpperCase()}`;
    }
    return acc;
  }, '');
  return initials.replace(/[^\p{L}|\p{N}]+/u, '');
}