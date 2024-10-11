import React from "react";
import { Tab, Tabs, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const TabPanel = (props) => {
  const { children, value, index } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      sx={{ mt: 6, padding: 0, minHeight: "500px" }}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
};

const GridTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-flexContainer": {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    rowGap: theme.spacing(0),
    columnGap: theme.spacing(4),
  },
}));

const GridTab = styled(Tab)(() => ({
  "&.MuiButtonBase-root": {
    marginRight: 0,
    gridColumn: "span 2",
  },
}));

const PrimaryTabs = ({ tabItems, activeTab, onTabChange }) => {
  const handleChange = (event, newValue) => {
    onTabChange(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <GridTabs
        aria-label="Tabs"
        variant="fullWidth"
        scrollButtons={false}
        value={activeTab}
        onChange={handleChange}
      >
        {tabItems.map((item) => (
          <GridTab disableRipple label={item.title} key={item.title} />
        ))}
      </GridTabs>
      {tabItems.map((item, index) => (
        <TabPanel value={activeTab} index={index} key={item.title}>
          {item.content}
        </TabPanel>
      ))}
    </Box>
  );
};

export default PrimaryTabs;
