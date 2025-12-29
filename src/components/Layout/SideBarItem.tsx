import { Link } from "react-router-dom";
import { Box, ListItem, ListItemButton, ListItemText } from "@mui/material";

interface SidebarItemProps {
  item: {
    path: string;
    title: string;
    icon?: string;
  };
  showLargeSideBar?: boolean;
  handleSidebarToggle?: () => void;
}

const SidebarItem = ({ item, showLargeSideBar = true }: SidebarItemProps) => {
  return (
    <>
      {showLargeSideBar && (
        <ListItem key={item.path}>
          <ListItemButton
            component={Link}
            to={item.path}
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box>{item.icon}</Box>

            <ListItemText primary={item.title} />
          </ListItemButton>
        </ListItem>
      )}
    </>
  );
};

export default SidebarItem;
