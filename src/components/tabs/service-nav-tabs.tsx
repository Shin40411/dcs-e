import { Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router";

export interface NavTabItem {
    label: string;
    path: string;
}

interface NavTabsProps {
    tabs: NavTabItem[];
    activePath: string;
}

export default function ServiceNavTabs({ tabs, activePath }: NavTabsProps) {
    const navigate = useNavigate();

    const activeIndex = tabs.findIndex((t) => t.path === activePath);

    return (
        <Tabs
            value={activeIndex >= 0 ? activeIndex : 0}
            onChange={(e, newIndex) => navigate(tabs[newIndex].path)}
            sx={{
                "& .MuiTabs-indicator": { display: "none" },
                "& .MuiTabs-flexContainer": {
                    gap: 0,
                },
            }}
        >
            {tabs.map((item) => (
                <Tab
                    key={item.path}
                    label={item.label}
                    sx={(theme) => ({
                        textTransform: "none",
                        minWidth: 100,
                        paddingX: 2,
                        fontSize: 14,
                        "&.Mui-selected": {
                            backgroundColor: theme.palette.primary.main,
                            color: "#fff",
                        },
                    })}
                />
            ))}
        </Tabs>
    );
}
