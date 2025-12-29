import { Box, List, Toolbar, Typography } from "@mui/material";
import SidebarItem from "./SideBarItem";
import { Link as RouterLink, type LinkProps } from "react-router-dom";
import { styled, type Theme } from "@mui/material/styles";
interface SideBarProps {
  items: any[];
  showLargeSideBar: boolean;
  handleSidebarToggle: () => void;
}

const SideBar = ({
  items,
  showLargeSideBar,
  handleSidebarToggle,
}: SideBarProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 3,
      }}
    >
      <Toolbar disableGutters>
        {showLargeSideBar ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <LinkStandard to={"/home"}>
              <Typography variant="body1" fontWeight={"bold"}>
              PsiFirm
              </Typography>
            </LinkStandard>
            <img src="/logo.png" alt="Logo" style={{ width: 60, height: 60 }} />
          </Box>
        ) : null}
      </Toolbar>
      <List sx={{ width: "100%", maxWidth: 360 }} className="px-1">
        {items?.map((item, index) => (
          <SidebarItem
            key={index}
            item={item}
            showLargeSideBar={showLargeSideBar}
            handleSidebarToggle={handleSidebarToggle}
          />
        ))}
      </List>
    </Box>
  );
};
interface LinkStandardProps extends LinkProps {
  to: string;
  children: React.ReactNode;
}

const StyledLink = styled(RouterLink)<{ theme?: Theme }>(({ theme }) => ({
  color: theme?.palette.primary.main,
  textDecoration: "none",
  "&:hover": {
    color: theme?.palette.primary.dark,
    textDecoration: "underline",
  },
}));

const LinkStandard: React.FC<LinkStandardProps> = ({
  to,
  children,
  ...props
}) => {
  return (
    <StyledLink to={to} {...props}>
      {children}
    </StyledLink>
  );
};
export default SideBar;
