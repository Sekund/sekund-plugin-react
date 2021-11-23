import { BadgeUnstyled } from "@mui/material";
import { styled } from '@mui/material/styles';
import React from 'react';

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
    border-radius: 10px;
    box-shadow: 0 0 0 1px #fff;
  }

  & .MuiBadge-dot {
    padding: 0;
    z-index: auto;
    min-width: 6px;
    width: 6px;
    height: 6px;
    border-radius: 100%;
    box-shadow: 0 0 0 1px #fff;
  }

  & .MuiBadge-anchorOriginTopRightCircular {
    position: absolute;
    top: 7px;
    right: 0;
    transform: translate(50%, -50%);
    transform-origin: 100% 0;
  }
`;

export const BlueBadge = styled(StyledBadge)`
& .MuiBadge-badge {
  background-color: blue;
}

& .MuiBadge-dot {
  background-color: blue;
}
`

export const GreenBadge = styled(StyledBadge)`
& .MuiBadge-badge {
  background-color: green;
}

& .MuiBadge-dot {
  background-color: green;
}
`

export const OrangeBadge = styled(StyledBadge)`
& .MuiBadge-badge {
  background-color: orange;
}

& .MuiBadge-dot {
  background-color: orange;
}
`