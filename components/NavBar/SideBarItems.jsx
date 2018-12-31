import React from "react";
import Link from "next/link";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import ReceiptIcon from "@material-ui/icons/Receipt";
import FeedbackIcon from "@material-ui/icons/Feedback";

export const SideBarItems = (
    <div>
        <Link prefetch href="/myaccount">
            <ListItem button>
                <ListItemIcon>
                    <AccountBoxIcon />
                </ListItemIcon>

                <ListItemText primary="My Account" />
            </ListItem>
        </Link>
        <Link prefetch href="/myorders">
            <ListItem button>
                <ListItemIcon>
                    <ReceiptIcon />
                </ListItemIcon>

                <ListItemText primary="My Orders" />
            </ListItem>
        </Link>

        <ListItem button>
            <ListItemIcon>
                <FeedbackIcon />
            </ListItemIcon>
            <ListItemText primary="Give Feedback" />
        </ListItem>
    </div>
);
