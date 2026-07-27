import { Box, Typography } from "@mui/material";
import React from "react";
import ProfileCard from "../profilecard/ProfileCard";
import SectionHeader from "../../shared/layout/SectionHeader";
import SurfaceCard from "../../shared/primitives/SurfaceCard";
import { tokens } from "../../styles/tokens";

const PeopleSearchResults = ({ people = [], onRefresh, variant = "section" }) => {
  if (!people.length) {
    return null;
  }

  if (variant === "list") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {people.map((person) => (
          <ProfileCard
            key={person.userName}
            profile={person}
            reSearch={onRefresh}
          />
        ))}
      </Box>
    );
  }

  return (
    <SurfaceCard padding={2}>
      <SectionHeader title="People" />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {people.map((person) => (
          <ProfileCard
            key={person.userName}
            profile={person}
            reSearch={onRefresh}
          />
        ))}
      </Box>
      {people.length === 0 ? (
        <Typography sx={{ fontSize: 14, color: tokens.colors.textSecondary }}>
          No people found.
        </Typography>
      ) : null}
    </SurfaceCard>
  );
};

export default PeopleSearchResults;
